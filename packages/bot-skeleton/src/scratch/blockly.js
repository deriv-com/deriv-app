/* eslint import/no-webpack-loader-syntax: 0 */
const {
    goog,
    Blockly,
} = require('imports-loader?this=>window!exports-loader?goog&Blockly!scratch-blocks/blockly_compressed_vertical');

Blockly.JavaScript = require('blockly/javascript');

window.goog = goog;
window.Blockly = Blockly;

require('imports-loader!scratch-blocks/msg/messages');
require('./blocks');
require('./hooks');
