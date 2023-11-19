import { TVideo } from '../Components/Form/ContractType/types';

export const getDescriptionVideoId = (videos: TVideo[] = [], trade_type = '') => {
    // finds a video id for the exact trade type by the video file name
    return videos.find(video => video.meta.name.startsWith(`dtrader_${trade_type}`))?.uid ?? '';
};

export const getDescriptionVideos = async (is_dark_mode_on = false): Promise<TVideo[]> => {
    const endpoint = `https://api.cloudflare.com/client/v4/accounts/${
        process.env.CLOUDFLARE_ACCOUNT_ID
    }/stream?search=description_${is_dark_mode_on ? 'dark' : 'light'}.mp4`;
    // finds all videos with name containing description_light.mp4 or description_dark.mp4
    try {
        const response = await fetch(endpoint, {
            headers: {
                Authorization: `bearer ${process.env.CLOUDFLARE_STREAM_API_TOKEN}`,
            },
        });
        const { result } = await response.json();
        return result;
    } catch (error) {
        return [];
    }
};
