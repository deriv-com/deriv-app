/* eslint import/no-webpack-loader-syntax: 0 */
const {
    goog,
    Blockly,
} = require('imports-loader?this=>window!exports-loader?goog&Blockly!scratch-blocks/blockly_compressed_vertical');

Blockly.JavaScript = new Blockly.Generator('code');
Blockly.JavaScript.init();

Blockly.JavaScript.quote_ = text => {
    return `'${text.replace(/\\/g, '\\\\').replace(/\n/g, '\\\n').replace(/'/g, "\\'")}'`;
};
// Blockly.JavaScript.definitions_ = {}

window.goog = goog;
window.Blockly = Blockly;

require('imports-loader!scratch-blocks/msg/messages');
require('./blocks');
require('./hooks');
