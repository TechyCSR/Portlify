import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
    aggregateReferrers,
    normalizeReferrer,
    resolveReferrer,
    sanitizeReferrerInput,
} from '../src/utils/referrer.js';

describe('sanitizeReferrerInput', () => {
    it('returns empty string for nullish and non-string values', () => {
        assert.equal(sanitizeReferrerInput(null), '');
        assert.equal(sanitizeReferrerInput(undefined), '');
        assert.equal(sanitizeReferrerInput(42), '');
        assert.equal(sanitizeReferrerInput({ source: 'x' }), '');
    });

    it('trims and caps referrer length', () => {
        assert.equal(sanitizeReferrerInput('  direct  '), 'direct');
        assert.equal(sanitizeReferrerInput(`https://example.com/${'a'.repeat(3000)}`).length, 2048);
    });
});

describe('normalizeReferrer', () => {
    const originalFrontendUrl = process.env.FRONTEND_URL;

    beforeEach(() => {
        process.env.FRONTEND_URL = 'https://portlify.app';
    });

    afterEach(() => {
        process.env.FRONTEND_URL = originalFrontendUrl;
    });

    it('normalizes direct traffic and legacy labels', () => {
        assert.deepEqual(normalizeReferrer(''), {
            id: 'direct',
            label: 'Direct / Link',
            category: 'direct',
            domain: null,
        });
        assert.equal(normalizeReferrer('direct').id, 'direct');
        assert.equal(normalizeReferrer('Direct / Link').id, 'direct');
    });

    it('detects AI assistants', () => {
        assert.deepEqual(normalizeReferrer('https://chatgpt.com/'), {
            id: 'chatgpt',
            label: 'ChatGPT',
            category: 'ai',
            domain: 'chatgpt.com',
        });
        assert.equal(normalizeReferrer('https://claude.ai/chat').label, 'Claude');
        assert.equal(normalizeReferrer('https://www.perplexity.ai/search').label, 'Perplexity');
        assert.equal(normalizeReferrer('https://gemini.google.com/app').label, 'Google Gemini');
        assert.equal(normalizeReferrer('https://copilot.microsoft.com/').label, 'Microsoft Copilot');
    });

    it('detects social and search sources', () => {
        assert.equal(normalizeReferrer('https://www.linkedin.com/in/user').label, 'LinkedIn');
        assert.equal(normalizeReferrer('https://t.co/abc').label, 'X (Twitter)');
        assert.equal(normalizeReferrer('https://www.google.com/search?q=portfolio').label, 'Google Search');
        assert.equal(normalizeReferrer('https://github.com/user').label, 'GitHub');
        assert.equal(normalizeReferrer('https://mail.google.com/').label, 'Gmail');
    });

    it('formats unknown websites by hostname', () => {
        assert.equal(normalizeReferrer('https://news.ycombinator.com/item').label, 'Ycombinator');
        assert.equal(normalizeReferrer('https://dev.to/post').label, 'Dev');
    });

    it('normalizes campaign links to canonical known sources', () => {
        assert.equal(normalizeReferrer('utm:linkedin:post').label, 'LinkedIn');
        assert.equal(normalizeReferrer('utm:newsletter:email').label, 'Newsletter');
        assert.equal(normalizeReferrer('utm:chatgpt:share').label, 'ChatGPT');
    });

    it('keeps custom campaign labels for unknown utm sources', () => {
        assert.equal(normalizeReferrer('utm:producthunt:launch').label, 'producthunt (launch)');
        assert.equal(normalizeReferrer('utm:partner::spring-drive').label, 'partner · spring-drive');
    });

    it('treats internal app traffic as direct', () => {
        assert.equal(normalizeReferrer('https://portlify.app/dashboard').id, 'direct');
        assert.equal(normalizeReferrer('https://www.portlify.app/ashish').id, 'direct');
        assert.equal(normalizeReferrer('http://localhost:5173/ashish').id, 'direct');
    });

    it('handles malformed referrer values safely', () => {
        assert.equal(normalizeReferrer('not a valid url at all').category, 'other');
        assert.equal(normalizeReferrer('   ').id, 'direct');
    });
});

describe('resolveReferrer', () => {
    it('sanitizes, normalizes, and canonicalizes in one step', () => {
        assert.deepEqual(resolveReferrer('  https://chatgpt.com/  '), {
            id: 'chatgpt',
            label: 'ChatGPT',
            category: 'ai',
            domain: 'chatgpt.com',
        });
        assert.equal(resolveReferrer(null).id, 'direct');
    });
});

describe('aggregateReferrers', () => {
    it('merges equivalent sources and legacy labels', () => {
        const aggregated = aggregateReferrers([
            { source: 'direct', count: 2 },
            { source: '', count: 1 },
            { source: 'Direct / Link', count: 4 },
            { source: 'https://chatgpt.com/', count: 3 },
            { source: 'https://www.chat.openai.com/', count: 2 },
        ]);

        assert.equal(aggregated[0].label, 'Direct / Link');
        assert.equal(aggregated[0].count, 7);
        assert.equal(aggregated[1].label, 'ChatGPT');
        assert.equal(aggregated[1].count, 5);
        assert.equal(aggregated[1].category, 'ai');
    });

    it('merges campaign and social variants for the same source', () => {
        const aggregated = aggregateReferrers([
            { source: 'utm:linkedin:post', count: 4 },
            { source: 'https://www.linkedin.com/feed/', count: 6 },
            { source: 'utm:linkedin:email', count: 2 },
        ]);

        assert.equal(aggregated.length, 1);
        assert.equal(aggregated[0].label, 'LinkedIn');
        assert.equal(aggregated[0].count, 12);
        assert.equal(aggregated[0].category, 'social');
    });

    it('sorts by count descending and ignores invalid entries', () => {
        const aggregated = aggregateReferrers([
            { source: 'https://google.com', count: 2 },
            null,
            { source: 'https://chatgpt.com', count: 5 },
            { count: 3 },
        ]);

        assert.equal(aggregated[0].label, 'ChatGPT');
        assert.equal(aggregated[1].label, 'Google Search');
    });

    it('returns an empty array when no valid referrers exist', () => {
        assert.deepEqual(aggregateReferrers([]), []);
        assert.deepEqual(aggregateReferrers([null, { count: 1 }]), []);
    });
});