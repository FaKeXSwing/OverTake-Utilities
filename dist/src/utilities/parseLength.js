export function convertToRealtime(ms) {
    const secondsTotal = Math.floor(ms / 1000);
    const days = Math.floor(secondsTotal / 86400);
    const hours = Math.floor((secondsTotal % 86400) / 3600);
    const minutes = Math.floor((secondsTotal % 3600) / 60);
    const seconds = secondsTotal % 60;
    const parts = [];
    if (days)
        parts.push(`${days} day${days > 1 ? "s" : ""}`);
    if (hours)
        parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    if (minutes)
        parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    if (seconds)
        parts.push(`${seconds} second${seconds > 1 ? "s" : ""}`);
    return parts.join(", ") || "0 seconds";
}
export function parseLength(input) {
    const regex = /(\d+)([dhms])/g;
    let totalMs = 0;
    const parts = [];
    let match;
    while ((match = regex.exec(input)) !== null) {
        const value = parseInt(match[1]);
        const unit = match[2];
        switch (unit) {
            case "d":
                totalMs += value * 24 * 60 * 60 * 1000;
                parts.push(`${value} day${value > 1 ? "s" : ""}`);
                break;
            case "h":
                totalMs += value * 60 * 60 * 1000;
                parts.push(`${value} hour${value > 1 ? "s" : ""}`);
                break;
            case "m":
                totalMs += value * 60 * 1000;
                parts.push(`${value} minute${value > 1 ? "s" : ""}`);
                break;
            case "s":
                totalMs += value * 1000;
                parts.push(`${value} second${value > 1 ? "s" : ""}`);
                break;
            default:
                return null;
        }
    }
    if (totalMs === 0)
        return null;
    return {
        ms: totalMs,
        realtime: parts.join(", ")
    };
}
