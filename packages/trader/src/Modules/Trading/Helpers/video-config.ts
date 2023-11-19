import { TVideo } from '../Components/Form/ContractType/types';

export const getDescriptionVideoId = (videos: TVideo[] = [], contract_type = '') => {
    return videos.find(video => video.meta.name.includes(`dtrader_${contract_type}`))?.uid ?? '';
};

export const getDescriptionVideos = async (is_dark_mode_on = false) => {
    const endpoint = `https://api.cloudflare.com/client/v4/accounts/${
        process.env.CLOUDFLARE_ACCOUNT_ID
    }/stream?search=description_${is_dark_mode_on ? 'dark' : 'light'}`;
    try {
        const response = await fetch(endpoint, {
            headers: {
                Authorization: `bearer ${process.env.CLOUDFLARE_STREAM_API_TOKEN}`,
            },
        });
        const result = await response.json();
        return result.result;
    } catch (error) {
        return [];
    }
};
