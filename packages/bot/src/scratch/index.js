import ScratchStore from '../stores/scratch-store';
import                   './blocks';
import                   './hooks';

export const scratchWorkspaceInit = async () => {
    try {
        const el_scratch_div = document.getElementById('scratch_div');
        const el_app_contents = document.getElementById('app_contents');

        // eslint-disable-next-line
        const toolbox_xml = await fetch(`${__webpack_public_path__}xml/toolbox.xml`).then(response => response.text());
        // eslint-disable-next-line
        const main_xml = await fetch(`${__webpack_public_path__}xml/main.xml`).then(response => response.text());

        const workspace = Blockly.inject(el_scratch_div, {
            grid    : { spacing: 40, length: 11, colour: '#ebebeb' },
            media   : `${__webpack_public_path__}media/`, // eslint-disable-line
            toolbox : toolbox_xml,
            trashcan: true,
            zoom    : { wheel: true },
        });

        Blockly.derivWorkspace = workspace;
        Blockly.derivWorkspace.blocksXmlStr = main_xml;

        // Ensure flyout closes on click in workspace.
        const el_blockly_svg = document.querySelector('.blocklySvg');
        document.addEventListener('click', (event) => {
            if (el_blockly_svg.contains(event.target)) {
                Blockly.derivWorkspace.toolbox_.clearSelection(); // eslint-disable-line
            }
        });
        
        // Keep in memory to allow category browsing
        workspace.initial_toolbox_xml = toolbox_xml;
        
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(main_xml), workspace);
        Blockly.derivWorkspace.clearUndo();

        const onWorkspaceResize = () => {
            const x = 0;
            const y = 76;
        
            // Position scratch_div over scratch_area.
            el_scratch_div.style.left   = `${x}px`;
            el_scratch_div.style.top    = `${y}px`;

            // el_scratch_div.style.left   = '0px';
            // el_scratch_div.style.top    = '0px';
            el_scratch_div.style.width  = `${el_app_contents.offsetWidth}px`;
            el_scratch_div.style.height = `${el_app_contents.offsetHeight}px`;
            
            Blockly.svgResize(workspace);

            // eslint-disable-next-line no-underscore-dangle
            workspace.toolbox_.flyout_.position();
            
            // Center on first root block, if applicable.
            const top_blocks = workspace.getTopBlocks(true);

            if (top_blocks.length > 0) {
                workspace.centerOnBlock(top_blocks[0].id);
            }
        };

        window.addEventListener('resize', onWorkspaceResize);
        onWorkspaceResize();

        const handleDragOver = e => {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy'; // eslint-disable-line no-param-reassign
        };

        const drop_zone = document.body;
        const { instance : { toolbar } } = ScratchStore;

        drop_zone.addEventListener('dragover', handleDragOver, false);
        drop_zone.addEventListener('drop', e => toolbar.handleFileChange(e), false);
    } catch (error) {
        // TODO: Handle error.
        throw error;
    }
};
