const isDarkModeEnabled = () => {
    const ui_store = localStorage.getItem('ui_store');

    if (ui_store && ui_store.length > 0) {
        return JSON.parse(ui_store).is_dark_mode_on || false;
    }
    return false;
};

export const setColors = () => {
    if (isDarkModeEnabled()) {
        Blockly.Colours.RootBlock = {
            colour: '#183046',
            colourSecondary: '#F2F3F5',
            colourTertiary: '#151717',
        };
        Blockly.Colours.Base = {
            colour: '#C2C2C2',
            colourSecondary: '#0e0e0e',
            colourTertiary: '#0e0e0e',
        };

        Blockly.Colours.Special1 = {
            colour: '#C2C2C2',
            colourSecondary: '#0e0e0e',
            colourTertiary: '#6d7278',
        };

        Blockly.Colours.Special2 = {
            colour: '#C2C2C2',
            colourSecondary: '#0e0e0e',
            colourTertiary: '#D27954',
        };

        Blockly.Colours.Special3 = {
            colour: '#C2C2C2',
            colourSecondary: '#0e0e0e',
            colourTertiary: '#D27954',
        };
    } else {
        Blockly.Colours.RootBlock = {
            colour: '#064e72',
            colourSecondary: '#064e72',
            colourTertiary: '#6d7278',
        };

        Blockly.Colours.Base = {
            colour: '#e5e5e5',
            colourSecondary: '#ffffff',
            colourTertiary: '#6d7278',
        };

        Blockly.Colours.Special1 = {
            colour: '#e5e5e5',
            colourSecondary: '#ffffff',
            colourTertiary: '#6d7278',
        };

        Blockly.Colours.Special2 = {
            colour: '#e5e5e5',
            colourSecondary: '#ffffff',
            colourTertiary: '#6d7278',
        };

        Blockly.Colours.Special3 = {
            colour: '#e5e5e5',
            colourSecondary: '#ffffff',
            colourTertiary: '#6d7278',
        };
    }
};

setColors();
