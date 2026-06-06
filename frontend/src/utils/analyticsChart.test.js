import { describe, it, expect, vi, afterEach } from 'vitest'
import {
    buildChartSeries,
    formatChartLabel,
    getChartBarHeight,
    getMonthLabelIndices,
    getUtcDayStart,
    normalizeDateKey,
} from './analyticsChart'

describe('normalizeDateKey', () => {
    it('normalizes dates to UTC midnight', () => {
        const key = normalizeDateKey('2026-06-06T10:00:00.000Z')

        expect(key).toBe(Date.UTC(2026, 5, 6))
    })
})

describe('buildChartSeries', () => {
    afterEach(() => {
        vi.useRealTimers()
    })

    it('builds 7-day and 30-day series with UTC dates', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-06-06T12:00:00Z'))

        const dailyStats = [
            { date: '2026-06-06T00:00:00.000Z', views: 6 },
            { date: '2026-06-04T00:00:00.000Z', views: 2 },
        ]

        const week = buildChartSeries(dailyStats, 'week')
        const month = buildChartSeries(dailyStats, 'month')

        expect(week).toHaveLength(7)
        expect(month).toHaveLength(30)
        expect(week[week.length - 1].views).toBe(6)
        expect(week[week.length - 3].views).toBe(2)
        expect(month[month.length - 1].views).toBe(6)
        expect(month[month.length - 3].views).toBe(2)
    })

    it('fills missing days with zero views', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-06-06T12:00:00Z'))

        const month = buildChartSeries([], 'month')

        expect(month).toHaveLength(30)
        expect(month.every((entry) => entry.views === 0)).toBe(true)
    })
})

describe('formatChartLabel', () => {
    afterEach(() => {
        vi.useRealTimers()
    })

    it('shows weekday labels for week view in UTC', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-06-06T12:00:00Z'))

        const week = buildChartSeries([], 'week')
        expect(formatChartLabel(week[0].date, 'week', 0, week.length)).toMatch(/^[A-Z][a-z]{2}$/)
    })

    it('shows spaced numeric labels for month view in UTC', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-06-06T12:00:00Z'))

        const month = buildChartSeries([], 'month')
        const labels = month.map((entry, index) =>
            formatChartLabel(entry.date, 'month', index, month.length)
        )

        expect(labels[0]).toBe('5/8')
        expect(labels[4]).toBe('')
        expect(labels[29]).toBe('6/6')
        expect(labels.filter(Boolean).length).toBeGreaterThanOrEqual(5)
        expect(labels.filter(Boolean).length).toBeLessThanOrEqual(7)
    })
})

describe('getUtcDayStart', () => {
    it('returns the UTC day key for a given date', () => {
        expect(getUtcDayStart(new Date('2026-06-06T23:30:00Z'))).toBe(Date.UTC(2026, 5, 6))
    })
})

describe('getChartBarHeight', () => {
    it('uses a subtle baseline for empty month bars', () => {
        expect(getChartBarHeight(0, 10, 'month')).toBe(2)
        expect(getChartBarHeight(0, 10, 'week')).toBe(0)
        expect(getChartBarHeight(6, 6, 'month')).toBe(192)
    })
})

describe('getMonthLabelIndices', () => {
    it('returns evenly spaced indices for 30 days', () => {
        expect(getMonthLabelIndices(30)).toEqual(new Set([0, 5, 10, 15, 20, 25, 29]))
    })
})