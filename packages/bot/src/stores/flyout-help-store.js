import {
    observable,
    action,
    runInAction,
}                   from 'mobx';
import config       from '../constants';

export default class FlyoutHelpStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    options = {
        css   : false,
        media : `${__webpack_public_path__}media/`,
        move  : { scrollbars: false, drag: true, wheel: false },
        zoom  : { startScale: config.workspaces.flyoutWorkspacesStartScale },
        sounds: false,
    };

    @observable block_node = null;
    @observable block_type = '';
    @observable help_string = {};
    @observable title = '';

    @action.bound
    setHelpContent = async block_node => {
        this.root_store.flyout.is_help_content = true;

        const block_hw = Blockly.Block.getDimensions(block_node);
        const block_type = block_node.getAttribute('type');
        const title = Blockly.Blocks[block_type].meta().display_name;
        const help_string  = await import(/* webpackChunkName: `[request]` */ `../scratch/help-content/help-string/${block_type}.json`);
        const start_scale = config.workspaces.flyoutWorkspacesStartScale;

        block_node.setAttribute('width', block_hw.width * start_scale);
        block_node.setAttribute('height', block_hw.height * start_scale);

        runInAction(() => {
            this.block_node = block_node;
            this.block_type = block_type;
            this.title = title;
            this.help_string = help_string;
        });
    }

    @action.bound
    onBackClick() {
        // eslint-disable-next-line no-underscore-dangle
        const toolbox = Blockly.derivWorkspace.toolbox_;
        const { toolbar, flyout } = this.root_store;

        if (flyout.is_search_flyout){
            const search = document.getElementsByName('search')[0].value;

            toolbar.onSearch({ search });
        } else {
            toolbox.refreshCategory();
        }
    }

    @action.bound
    async onSequenceClick(should_go_next) {
        // eslint-disable-next-line no-underscore-dangle
        const toolbox = Blockly.derivWorkspace.toolbox_;
        const selected_category = toolbox.getSelectedItem();
        const xml_list = toolbox.getCategoryContents(selected_category);
        const xml_list_group = this.groupBy(xml_list, true);
        const current_block = xml_list.find(xml => xml.getAttribute('type') === this.block_type);

        let current_block_index;

        Object.keys(xml_list_group).forEach((key, index) => {
            if (current_block.getAttribute('type') === key) {
                current_block_index = index;
            }
        });

        const getNextBlock = async (xml, current_index, direction) => {
            const next_index = current_index + (direction ? 1 : -1);
            const block_type = Object.keys(xml).find((key, index) => next_index === index);
            // eslint-disable-next-line consistent-return
            if (!block_type) return;
            try {
                await import(/* webpackChunkName: `[request]` */ `../scratch/help-content/help-string/${block_type}.json`);
                // eslint-disable-next-line consistent-return
                return block_type;
            } catch (e) {
                // eslint-disable-next-line consistent-return
                return getNextBlock(xml,next_index,direction);
            }
        };

        const block_type = await getNextBlock(xml_list_group,current_block_index,should_go_next);
        if (block_type) {
            const target_blocks = xml_list_group[block_type];
            this.setHelpContent(target_blocks[0]);
        }
    }

    // eslint-disable-next-line
    groupBy(nodes, should_include_block_only = false) {
        return nodes.reduce(function (block_group, node) {
            const type = node.getAttribute('type');

            if (should_include_block_only && type === null) {
                return block_group;
            }

            if (!block_group[type]){
                block_group[type] = [];
            }

            if (!should_include_block_only || (should_include_block_only && type !== null)) {
                block_group[type].push(node);
            }

            return block_group;
        }, {});
    }
}
