import config from '../../constants';

export const hasAllRequiredBlocks = () => {
    const blocks_in_workspace = Blockly.derivWorkspace.getAllBlocks();
    const { mandatoryMainBlocks } = config;
    const required_block_types    = ['trade_definition_tradeoptions', ...mandatoryMainBlocks];
    const all_block_types         = blocks_in_workspace.map(block => block.type);
    const has_all_required_blocks = required_block_types.every(required_block_type =>
        all_block_types.includes(required_block_type));

    return has_all_required_blocks;
};
