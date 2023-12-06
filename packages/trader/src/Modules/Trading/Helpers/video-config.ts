type TDtraderVideoUrl = {
    [key: string]: TVideoVariants;
};

type TVideoVariants = {
    dark: string;
    light: string;
};

/* The video upload feature is not available yet. The following video uids are taken from CF Stream account.
If considered necessary later, the current approach can be replaced with HTTP-request to fetch videos by their file names. */
export const DESCRIPTION_VIDEO_ID: TDtraderVideoUrl = {
    accumulator: {
        light: '3a8f185f22a3e2b9da59cea6e70e706e',
        dark: '0602069e9de7f4206929402606928853',
    },
    turbos: {
        light: '4d03df21b56b33101806394f9bdffb43',
        dark: '8d71878b0f2ba06cf83b51919e50d77b',
    },
    vanilla: {
        light: 'bed2bd4d874b15999590265e25b7778b',
        dark: '0d22d76a321833f1c6b732cf055057ae',
    },
};

export const getDescriptionVideoId = (contract_type = '', is_dark_theme = false) =>
    DESCRIPTION_VIDEO_ID[contract_type]?.[is_dark_theme ? 'dark' : 'light'];
