import goog from './goog.js';
import * as BlocklyJavaScript from 'blockly/javascript';
import { setColors } from './hooks/colours.js';
import { getLanguage } from '@deriv/translations';

async function setBlocklyLocale() {
    const languageModule = await import(`blockly/msg/${getLanguage().toLowerCase()}.js`);
    const Blockly = languageModule.default || languageModule;
    window.Blockly.setLocale(Blockly);
}

window.goog = goog;

export const loadBlockly = async isDarkMode => {
    const BlocklyModule = await import('blockly');
    window.Blockly = BlocklyModule.default;
    window.Blockly.Colours = {};
    const BlocklyGenerator = new Blockly.Generator('code');
    const BlocklyJavaScriptGenerator = {
        ...BlocklyJavaScript,
        ...BlocklyGenerator,
    };
    window.Blockly.JavaScript = BlocklyJavaScriptGenerator;
    window.Blockly.Themes.zelos_renderer = Blockly.Theme.defineTheme('zelos_renderer', {
        base: Blockly.Themes.Zelos,
        componentStyles: {},
    });
    setColors(isDarkMode);
    setBlocklyLocale();
    await import('./hooks');
    await import('./blocks');
};
