const darkMode = () => {
    const workspace = Blockly;
    workspace.Colours.RootBlock = {
        colour: '#183046',
        colourSecondary: '#F2F3F5',
        colourTertiary: '#151717',
    };
    workspace.Colours.Base = {
        colour: '#C2C2C2',
        colourSecondary: '#0e0e0e',
        colourTertiary: '#0e0e0e',
    };

    workspace.Colours.Special1 = {
        colour: '#C2C2C2',
        colourSecondary: '#0e0e0e',
        colourTertiary: '#6d7278',
    };

    workspace.Colours.Special2 = {
        colour: '#C2C2C2',
        colourSecondary: '#0e0e0e',
        colourTertiary: '#D27954',
    };

    workspace.Colours.Special3 = {
        colour: '#C2C2C2',
        colourSecondary: '#0e0e0e',
        colourTertiary: '#D27954',
    };
};

const lightMode = () => {
    const workspace = Blockly;
    workspace.Colours.RootBlock = {
        colour: '#064e72',
        colourSecondary: '#064e72',
        colourTertiary: '#6d7278',
    };

    workspace.Colours.Base = {
        colour: '#e5e5e5',
        colourSecondary: '#ffffff',
        colourTertiary: '#6d7278',
    };

    workspace.Colours.Special1 = {
        colour: '#e5e5e5',
        colourSecondary: '#ffffff',
        colourTertiary: '#6d7278',
    };

    workspace.Colours.Special2 = {
        colour: '#e5e5e5',
        colourSecondary: '#ffffff',
        colourTertiary: '#6d7278',
    };

    workspace.Colours.Special3 = {
        colour: '#e5e5e5',
        colourSecondary: '#ffffff',
        colourTertiary: '#6d7278',
    };
};
export const setColors = is_dark_mode => (is_dark_mode ? darkMode() : lightMode());
