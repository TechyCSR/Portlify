export function getUtcDayStart(date = new Date()) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function isSameUtcDay(a, b) {
    return getUtcDayStart(a).getTime() === getUtcDayStart(b).getTime();
}

export function shiftUtcDays(date, days) {
    const shifted = new Date(date.getTime());
    shifted.setUTCDate(shifted.getUTCDate() + days);
    return shifted;
}