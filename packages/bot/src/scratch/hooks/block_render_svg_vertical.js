/* eslint-disable func-names, no-underscore-dangle */
// UI constants for rendering blocks.
goog.require('Blockly.BlockSvg');

// Deriv-bot: Set the minimum width of a statement block to be wider than default.
Blockly.BlockSvg.MIN_BLOCK_X_WITH_STATEMENT = 100 * Blockly.BlockSvg.GRID_UNIT;

// Deriv-bot: Root block hat replaces with standard rounded corner
Blockly.BlockSvg.START_HAT_PATH =
`m 0,${  Blockly.BlockSvg.CORNER_RADIUS  } A ${  Blockly.BlockSvg.CORNER_RADIUS  },${
    Blockly.BlockSvg.CORNER_RADIUS  } 0 0,1 ${
    Blockly.BlockSvg.CORNER_RADIUS  },0`;

// Deriv-bot: Changed the height of a row in a statement block to be 10.
Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y = 10 * Blockly.BlockSvg.GRID_UNIT;

// Deriv-bot: visual improvement: changed editable field padding from 8 to 16
Blockly.BlockSvg.EDITABLE_FIELD_PADDING = 16;
