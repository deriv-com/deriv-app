/* eslint import/no-webpack-loader-syntax: 0 */
const { goog, Blockly } = require('exports-loader?goog&Blockly!scratch-blocks/blockly_compressed_vertical');

window.goog = goog;
window.Blockly = Blockly;

require('imports-loader!scratch-blocks/msg/messages.js');
require('imports-loader!blockly/generators/javascript');
require('imports-loader!./blocks');
require('imports-loader!./hooks');
