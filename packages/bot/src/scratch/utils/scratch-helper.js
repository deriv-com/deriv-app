import config               from '../../constants';
import { getToolbarHeight } from '../../utils/window-size';

export const hasAllRequiredBlocks = () => {
    const blocks_in_workspace     = Blockly.derivWorkspace.getAllBlocks();
    const { mandatoryMainBlocks } = config;
    const required_block_types    = ['trade_definition_tradeoptions', ...mandatoryMainBlocks];
    const all_block_types         = blocks_in_workspace.map(block => block.type);
    const has_all_required_blocks = required_block_types.every(required_block_type =>
        all_block_types.includes(required_block_type));

    return has_all_required_blocks;
};

export const onWorkspaceResize = () => {
    const el_scratch_div        = document.getElementById('scratch_div');
    const el_app_contents       = document.getElementById('app_contents');
    el_scratch_div.style.width  = `${el_app_contents.offsetWidth}px`;
    el_scratch_div.style.height = `${el_app_contents.offsetHeight - getToolbarHeight()}px`;
    Blockly.svgResize(Blockly.derivWorkspace);
};
