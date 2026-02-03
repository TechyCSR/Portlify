import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Helper to check if a point is inside a rect
function isPointInRect(x, y, rect) {
    // rect is [x1, y1, x2, y2] (bottom-left, top-right) usually in PDF
    // But pdfjs might normalize. Let's assume [xMin, yMin, xMax, yMax]
    return x >= rect[0] && x <= rect[2] && y >= rect[1] && y <= rect[3];
}

// Helper to check if two rects overlap significantly
function doRectsOverlap(rect1, rect2) {
    // rect: [x, y, w, h]? No, pdf uses [x1, y1, x2, y2]
    const xOverlap = Math.max(0, Math.min(rect1[2], rect2[2]) - Math.max(rect1[0], rect2[0]));
    const yOverlap = Math.max(0, Math.min(rect1[3], rect2[3]) - Math.max(rect1[1], rect2[1]));

    return xOverlap > 0 && yOverlap > 0;
}

/**
 * Extract text and embedded links from a PDF buffer
 * @param {Uint8Array} dataBuffer - PDF data
 * @returns {Promise<string>} - Extracted text with [Link: URL] annotations
 */
export async function extractTextWithLinks(dataBuffer) {
    try {
        const loadingTask = pdfjsLib.getDocument({ data: dataBuffer });
        const doc = await loadingTask.promise;

        let fullText = '';

        for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const textContent = await page.getTextContent();
            const annotations = await page.getAnnotations();

            // Filter for link annotations with URLs
            const links = annotations.filter(a => a.subtype === 'Link' && a.url);

            // Convert text items to a list with coordinates
            // textContent.items has { str, transform, width, height }
            // transform is [scaleX, skewY, skewX, scaleY, x, y]
            // We need to approximate the rect of the text item.
            // Note: height in item might be 0, use font size?

            let pageText = '';

            // Sort items by Y (descending) then X (ascending) to maintain reading order
            const items = textContent.items.sort((a, b) => {
                // Y is typically 6th element (index 5). PDF coords: Y grows upwards? 
                // Usually PDF origin is bottom-left. So higher Y is higher on page.
                // We want to read Top to Bottom -> Descending Y.
                // However, let's just trust the order or sort? 
                // pdfjs text extraction usually returns items in some order, but sorting helps.
                if (Math.abs(b.transform[5] - a.transform[5]) > 5) { // Same line threshold
                    return b.transform[5] - a.transform[5]; // Top to bottom
                }
                return a.transform[4] - b.transform[4]; // Left to right
            });

            // Iterate items and check for links
            for (const item of items) {
                const tx = item.transform[4]; // x
                const ty = item.transform[5]; // y
                const tw = item.width;
                const th = item.height || 10; // Fallback height

                // Construct item rect [x, y, x+w, y+h]
                // Note: PDF y increases upwards.
                // So the "box" is from y to y+h? Or y-h to y?
                // Text baseline is at 'y'. So the box is roughly y to y + fontHeight?
                // Actually usually y is the baseline. The box goes up.
                const itemRect = [tx, ty, tx + tw, ty + th];

                let linkUrl = null;

                // Check if this text item overlaps with any link annotation
                for (const link of links) {
                    if (link.rect && doRectsOverlap(itemRect, link.rect)) {
                        linkUrl = link.url;
                        break;
                    }
                }

                pageText += item.str;
                if (linkUrl) {
                    pageText += ` [Link: ${linkUrl}] `;
                }

                // Add space if items are far apart? item.hasEOL might help
                if (item.hasEOL) {
                    pageText += '\n';
                } else {
                    pageText += ' '; // Basic spacing
                }
            }

            fullText += pageText + '\n\n';
        }

        return fullText;
    } catch (error) {
        console.error('PDF Link Extraction Error:', error);
        // Fallback: Return empty string or throw, let caller handle
        throw error;
    }
}
