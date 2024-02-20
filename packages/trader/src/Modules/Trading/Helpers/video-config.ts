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
        light: '29503b759673ded4474e35673d01f9b4',
        dark: 'b12da36650ec8f51ff1ab7d92a9b434a',
    },
    high_low: {
        light: 'ce561710371cfed69ff611a354e3fa71',
        dark: 'bf5a9e4f8294ca18f1c67db864a88b6f',
    },
    rise_fall: {
        light: '8f6fb30a657da5ce6dcd01771e6b4c45',
        dark: '4e8c7f882beadf32ff6eb19b71946ca9',
    },
    touch: {
        light: '2413d2a82b1a15266fcb2387d217d586',
        dark: 'b34b30d90f6012a7b384c6be89fd117f',
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
