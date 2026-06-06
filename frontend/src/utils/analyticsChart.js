export const CHART_HEIGHT_PX = 192

const UTC_LABEL_OPTIONS = { timeZone: 'UTC' }

export function normalizeDateKey(date) {
    const normalized = new Date(date)
    return Date.UTC(
        normalized.getUTCFullYear(),
        normalized.getUTCMonth(),
        normalized.getUTCDate(),
    )
}

export function getUtcDayStart(date = new Date()) {
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

export function buildChartSeries(dailyStats, period) {
    const dayCount = period === 'week' ? 7 : 30
    const viewsByDate = new Map(
        (dailyStats || []).map((stat) => [normalizeDateKey(stat.date), stat.views || 0])
    )

    const todayUtc = getUtcDayStart()

    const series = []
    for (let offset = dayCount - 1; offset >= 0; offset -= 1) {
        const dayKey = todayUtc - offset * 86400000
        series.push({
            date: new Date(dayKey),
            views: viewsByDate.get(dayKey) || 0,
        })
    }

    return series
}

export function getMonthLabelIndices(total) {
    if (total <= 1) {
        return new Set([0])
    }

    const step = Math.max(Math.floor(total / 6), 1)
    const indices = new Set([0, total - 1])

    for (let index = step; index < total - 1; index += step) {
        indices.add(index)
    }

    return indices
}

export function formatChartLabel(date, period, index, total) {
    if (period === 'week') {
        return date.toLocaleDateString('en-US', { weekday: 'short', ...UTC_LABEL_OPTIONS })
    }

    if (!getMonthLabelIndices(total).has(index)) {
        return ''
    }

    return date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        ...UTC_LABEL_OPTIONS,
    })
}

export function formatChartTooltip(date, views) {
    const label = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        ...UTC_LABEL_OPTIONS,
    })

    return `${label}: ${views} view${views === 1 ? '' : 's'}`
}

export function getChartBarHeight(views, maxViews, period) {
    if (views > 0) {
        return Math.max((views / maxViews) * CHART_HEIGHT_PX, 6)
    }

    return period === 'month' ? 2 : 0
}

export function getChartGapClass(period) {
    return period === 'month' ? 'gap-px' : 'gap-1.5 sm:gap-2'
}