import { v2 as cloudinary } from 'cloudinary';

function isTransformationSegment(segment) {
    return /^s--.+--$/.test(segment)
        || /^fl_/.test(segment)
        || /^[a-z]{1,3}_[a-z0-9_,.-]+$/i.test(segment);
}

/**
 * Extract public_id from a Cloudinary raw delivery URL.
 */
export function extractPublicIdFromUrl(fileUrl) {
    const uploadMarker = '/raw/upload/';
    const markerIndex = fileUrl.indexOf(uploadMarker);
    if (markerIndex === -1) {
        throw new Error('Could not parse Cloudinary URL');
    }

    const pathAfterUpload = fileUrl.slice(markerIndex + uploadMarker.length).split('?')[0];
    const segments = pathAfterUpload.split('/').filter(Boolean);
    if (segments.length === 0) {
        throw new Error('Could not parse Cloudinary URL');
    }

    let publicIdStart = 0;
    for (let i = 0; i < segments.length; i++) {
        if (/^v\d+$/.test(segments[i])) {
            publicIdStart = i + 1;
            break;
        }
    }

    if (publicIdStart === 0) {
        while (publicIdStart < segments.length - 1 && isTransformationSegment(segments[publicIdStart])) {
            publicIdStart++;
        }
    }

    const publicIdWithExt = segments.slice(publicIdStart).join('/');
    if (!publicIdWithExt) {
        throw new Error('Could not parse Cloudinary URL');
    }

    const lastDot = publicIdWithExt.lastIndexOf('.');
    const publicId = lastDot > 0 ? publicIdWithExt.slice(0, lastDot) : publicIdWithExt;
    const format = lastDot > 0 ? publicIdWithExt.slice(lastDot + 1) : undefined;

    return { publicId, format };
}

/**
 * Build a signed Cloudinary URL for server-side download.
 * Required when the account restricts public delivery of PDFs/raw files.
 */
export function getSignedCloudinaryDownloadUrl(fileUrl) {
    const { publicId, format } = extractPublicIdFromUrl(fileUrl);

    return cloudinary.url(publicId, {
        resource_type: 'raw',
        type: 'upload',
        secure: true,
        sign_url: true,
        ...(format ? { format } : {})
    });
}