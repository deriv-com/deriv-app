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
        light: '6e46c112851bd002d78ad8481e47b0ca',
        dark: 'c11a56449976f2a111a9ba6bfad496f4',
    },
    turbos: {
        light: 'c09f5ebb317f702067289323c405544d',
        dark: '50b3064f0d468726defa4dabe1d8d04d',
    },
    vanilla: {
        light: 'b7d10cca1efd4a50674347ba77f35259',
        dark: '8ddb543bbfd6b92d26f72a97c0ae6f0f',
    },
};

export const getDescriptionVideoId = (contract_type = '', is_dark_theme = false) =>
    DESCRIPTION_VIDEO_ID[contract_type]?.[is_dark_theme ? 'dark' : 'light'];
