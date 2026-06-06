import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getUtcDayStart, isSameUtcDay, shiftUtcDays } from '../src/utils/analyticsDates.js';

describe('analyticsDates', () => {
    it('normalizes dates to UTC midnight', () => {
        const day = getUtcDayStart(new Date('2026-06-06T23:30:00Z'));

        assert.equal(day.toISOString(), '2026-06-06T00:00:00.000Z');
    });

    it('shifts UTC day buckets without local timezone drift', () => {
        const today = getUtcDayStart(new Date('2026-06-06T12:00:00Z'));
        const weekAgo = shiftUtcDays(today, -7);

        assert.equal(weekAgo.toISOString(), '2026-05-30T00:00:00.000Z');
    });

    it('treats legacy local-midnight buckets as the same UTC day', () => {
        const utcMidnight = getUtcDayStart(new Date('2026-06-06T12:00:00Z'));
        const legacyBucket = new Date('2026-06-06T07:00:00.000Z');

        assert.equal(isSameUtcDay(legacyBucket, utcMidnight), true);
    });
});