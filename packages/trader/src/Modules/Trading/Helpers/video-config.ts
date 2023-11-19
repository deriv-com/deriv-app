type TDtraderVideoUrl = {
    [key: string]: TVideoVariants;
};

type TVideoVariants = {
    dark: string;
    light: string;
};

export const CF_STREAM_CUSTOMER_URL = 'https://customer-hhvo3ceuqt00w8g8.cloudflarestream.com';
/* The video upload feature is not available yet. The following video uids are taken from CF Stream account. */
export const DESCRIPTION_VIDEO_ID: TDtraderVideoUrl = {
    accumulator: {
        light: 'dc6145aaee3f6b3f1cd96be9a3d1bfee',
        dark: 'e122519abc977631e67d21fbe08e8192',
    },
    turbos: {
        light: 'df97133addc5b8863a617e03697ea051',
        dark: '38041ca7fdd5388df4db9563608d0bcc',
    },
    vanilla: {
        light: '2bacfe56a73840d1a4f3239affedaab2',
        dark: 'ed81e651f8bf01ab80e968091dc7fa35',
    },
};

export const getDescriptionVideoId = (contract_type = '', is_dark_theme = false) =>
    DESCRIPTION_VIDEO_ID[contract_type]?.[is_dark_theme ? 'dark' : 'light'];

export const getVideoDownloadUrl = (contract_type = '', is_dark_theme = false) => {
    const uid = getDescriptionVideoId(contract_type, is_dark_theme);
    /* The following url will work only if the MP4 download is enabled for the video in the CF Stream account */
    return uid ? `${CF_STREAM_CUSTOMER_URL}${uid}/downloads/default.mp4` : '';
};
