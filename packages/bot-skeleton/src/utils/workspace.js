import { config } from '../constants';

export const onWorkspaceResize = () => {
    const workspace = Blockly.derivWorkspace;
    if (workspace) {
        workspace.getAllFields().forEach(field => field.forceRerender());

        const el_scratch_div = document.getElementById('scratch_div');
        if (el_scratch_div) {
            el_scratch_div.style.width = '100vw';
            el_scratch_div.style.height = 'var(--bot-content-height)';
            Blockly.svgResize(workspace);
        }
    }
};

export const removeLimitedBlocks = (workspace, block_types) => {
    const types = Array.isArray(block_types) ? block_types : [block_types];

    types.forEach(block_type => {
        if (config.single_instance_blocks.includes(block_type)) {
            workspace.getAllBlocks().forEach(ws_block => {
                if (ws_block.type === block_type) {
                    ws_block.dispose();
                }
            });
        }
    });
};
