import { TTrustpilotWidgetData } from 'Types';

export const fetchTrustpilotData = async () => {
    const defaultData = {
        stars: 4.5,
        trustScore: 4.5,
        numberOfReviews: Number(47748).toLocaleString(),
    };

    try {
        const appName = 'deriv.com';
        const apiKey = process.env.TRUSTPILOT_API_KEY;

        if (!appName || !apiKey) {
            return {
                ...defaultData,
                error: 'Trustpilot app name or API key is missing',
            };
        }

        const url = `https://api.trustpilot.com/v1/business-units/find?name=${appName}&apikey=${apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            return {
                ...defaultData,
                error: `Network response was not ok: ${response.statusText}`,
            };
        }

        const result = await response.json();

        const trustpilotData: TTrustpilotWidgetData = {
            stars: result.score?.stars || defaultData.stars,
            trustScore: result.score?.trustScore || defaultData.trustScore,
            numberOfReviews: result.numberOfReviews?.total?.toLocaleString() || defaultData.numberOfReviews,
        };

        return trustpilotData;
    } catch (error) {
        const trustpilotData: TTrustpilotWidgetData = {
            ...defaultData,
            error: `Something wrong: error = ${error}`,
        };

        return trustpilotData;
    }
};
