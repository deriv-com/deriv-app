/*
Temp solution for growthbook to fetch country and handle experiments/fratures without causing inconsistencies to the UI. 
*/

const getCountry = async () => {
    try {
        const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace').catch(() => null);
        const text = response ? await response.text().catch(() => '') : '';
        const entries = text ? text.split('\n').map(v => v.split('=', 2)) : [];
        const data = entries.length ? Object.fromEntries(entries) : {};
        return data?.loc?.toLowerCase() ?? '';
    } catch {
        return '';
    }
};

export default getCountry;
