/**
 * Gets a trade definition block instance and returns it.
 * @returns {Blockly.Block|null} The trade definition or null.
 */
Blockly.Workspace.prototype.getTradeDefinitionBlock = function() {
    return this.getAllBlocks(true).find(b => b.type === 'trade_definition');
};
