import { TTrustpilotWidgetData } from 'Types';

export const fetchTrustpilotData = async () => {
    try {
        const appName = 'deriv.com';
        const apiKey = process.env.TRUSTPILOT_API_KEY;

        if (!appName || !apiKey) {
            return {
                error: 'Trustpilot app name or API1 key is missing',
            };
        }

        const url = `https://api.trustpilot.com/v1/business-units/find?name=${appName}&apikey=${apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            return {
                error: `Network response was not ok: ${response.statusText}`,
            };
        }

        const result = await response.json();

        const trustpilotData: TTrustpilotWidgetData = {
            stars: result.score?.stars || 0,
            trustScore: result.score?.trustScore || 0,
            numberOfReviews: result.numberOfReviews?.total || 0,
        };

        return trustpilotData;
    } catch (error) {
        return { error: `Something wrong: error = ${error}` };
    }
};
