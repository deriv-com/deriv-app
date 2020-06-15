export const colors = Object.freeze({
    black: '#0e0e0e',
    black_1: '#333333',
    black_3: '#151717',
    black_6: '#3e3e3e',
    grey: '#c2c2c2',
    grey_1: '#999999',
    grey_2: '#f2f3f4',
    grey_6: '#d6d6d6',
    grey_7: '#d6d6d6',
    white: '#FFFFFF',
    green: '#85acb0',
    green_1: '#4bb4b3',
    green_3: '#00a79e',
    red_1: '#ec3f3f',
    red_2: '#cc2e3d',
    red_coral: '#ff444f',
});

const brand = Object.freeze({
    red_coral: colors.red_coral,
    secondary: colors.green,
});

export const light_theme_config = Object.freeze({
    brand,
    general: Object.freeze({
        section_1: colors.grey_2,
    }),
    text: Object.freeze({
        prominent: colors.black_1,
        profit_success: colors.green_1,
        loss_danger: colors.red_1,
        disabled: colors.grey_6,
        less_prominent: colors.grey_1,
        general: colors.black_1,
    }),
});

export const dark_theme_config = Object.freeze({
    brand,
    general: Object.freeze({
        section_1: colors.black_3,
    }),
    text: Object.freeze({
        prominent: colors.white,
        profit_success: colors.green_3,
        loss_danger: colors.red_2,
        disabled: colors.black_6,
        less_prominent: colors.grey_7,
        general: colors.grey,
    }),
});
