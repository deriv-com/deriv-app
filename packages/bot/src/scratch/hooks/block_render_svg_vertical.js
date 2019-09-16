/* eslint-disable func-names, no-underscore-dangle */
// UI constants for rendering blocks.
goog.require('Blockly.BlockSvg');

/**
 * Minimum width of a C- or E-shaped block.
 * @const
 */

// min width changed from 40 to 100
Blockly.BlockSvg.MIN_BLOCK_X_WITH_STATEMENT = 100 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Path of the top hat's curve.
 * @const
 */

// Root block hat replaces with standard rounded corner
Blockly.BlockSvg.START_HAT_PATH =
`m 0,${  Blockly.BlockSvg.CORNER_RADIUS  } A ${  Blockly.BlockSvg.CORNER_RADIUS  },${
    Blockly.BlockSvg.CORNER_RADIUS  } 0 0,1 ${
    Blockly.BlockSvg.CORNER_RADIUS  },0`;

/**
 * Height of extra row after a statement input.
 * @const
 */

// changed from 8 to 10
Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y = 10 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Editable field padding (left/right of the text).
 * @const
 */
// changed from 8 to 16
Blockly.BlockSvg.EDITABLE_FIELD_PADDING = 16;
