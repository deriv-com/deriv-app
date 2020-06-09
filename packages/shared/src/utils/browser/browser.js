export const parseUA = user_agent => {
    const lookup = [
        { name: 'Edge', regex: /(?:edge|edga|edgios|edg)\/([\d\w.-]+)/i },
        { name: 'SeaMonkey', regex: /seamonkey\/([\d\w.-]+)/i },
        { name: 'Opera', regex: /(?:opera|opr)\/([\d\w.-]+)/i },
        { name: 'Chromium', regex: /(?:chromium|crios)\/([\d\w.-]+)/i },
        { name: 'Chrome', regex: /chrome\/([\d\w.-]+)/i },
        { name: 'Safari', regex: /version\/([\d\w.-]+)/i },
        { name: 'IE', regex: /msie\s([\d.]+[\d])/i },
        { name: 'IE', regex: /trident\/\d+\.\d+;.*[rv:]+(\d+\.\d)/i },
        { name: 'Firefox', regex: /firefox\/([\d\w.-]+)/i },
        { name: 'Binary app', regex: /binary\.com V([\d.]+)/i },
    ];
    for (let i = 0; i < lookup.length; i++) {
        const info = lookup[i];
        const match = user_agent.match(info.regex);
        if (match !== null) {
            return {
                name: info.name,
                version: match[1],
            };
        }
    }
    return null;
};
