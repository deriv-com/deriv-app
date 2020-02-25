import { observable, action, runInAction } from 'mobx';
import { config } from '@deriv/bot-skeleton';

export default class FlyoutHelpStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    options = {
        css: false,
        media: `${__webpack_public_path__}media/`,
        move: { scrollbars: false, drag: true, wheel: false },
        zoom: { startScale: config.workspaces.flyoutWorkspacesStartScale },
        sounds: false,
    };

    @observable block_node = null;
    @observable block_type = '';
    @observable help_string = {};
    @observable title = '';
    @observable should_next_disable = false;
    @observable should_previous_disable = false;

    @action.bound
    setHelpContent = async block_node => {
        const block_hw = Blockly.Block.getDimensions(block_node);
        const block_type = block_node.getAttribute('type');
        const title = Blockly.Blocks[block_type].meta().display_name;

        /* TODO break each help-string a separate chunk and load it on demand, for this we need to loop
        through the folder in bot-skeleton webpack and create entrypoint of each file. then import them as :
        const help_string_obj = await import(/* webpackChunkName: `[request]` `@deriv/bot-skeleton/${block_type}`; */
        const help_string_obj = await import(/* webpackChunkName: `[request]` */ '@deriv/bot-skeleton');
        const start_scale = config.workspaces.flyoutWorkspacesStartScale;

        block_node.setAttribute('width', block_hw.width * start_scale);
        block_node.setAttribute('height', block_hw.height * start_scale);

        const { flyout } = this.root_store;
        runInAction(() => {
            flyout.is_help_content = true;
            this.block_node = block_node;
            this.block_type = block_type;
            this.title = title;
            this.help_string = help_string_obj.default[block_type];
        });

        if (!flyout.is_search_flyout) {
            this.updateSequenceButtons();
        }
    };

    @action.bound
    onBackClick() {
        // eslint-disable-next-line no-underscore-dangle
        const toolbox = Blockly.derivWorkspace.toolbox_;
        const { toolbar, flyout } = this.root_store;

        if (flyout.is_search_flyout) {
            const search = document.getElementsByName('search')[0].value;

            toolbar.onSearch({ search });
        } else {
            toolbox.refreshCategory();
        }
    }

    @action.bound
    async onSequenceClick(should_go_next) {
        const current_block = this.xml_list.find(xml => xml.getAttribute('type') === this.block_type);

        let current_block_index;

        Object.keys(this.xml_list_group).forEach((key, index) => {
            if (current_block.getAttribute('type') === key) {
                current_block_index = index;
            }
        });

        const getNextBlock = async (xml, current_index, direction) => {
            const next_index = current_index + (direction ? 1 : -1);
            const block_type = Object.keys(xml).find((key, index) => next_index === index);

            if (!block_type) {
                return false;
            }

            try {
                await import(/* webpackChunkName: `[request]` */ '@deriv/bot-skeleton');
                return block_type;
            } catch (e) {
                return getNextBlock(xml, next_index, direction);
            }
        };

        const block_type = await getNextBlock(this.xml_list_group, current_block_index, should_go_next);
        if (block_type) {
            const target_blocks = this.xml_list_group[block_type];
            this.setHelpContent(target_blocks[0]);
        }
    }

    @action.bound
    initialiseFlyoutHelp(block_node) {
        const toolbox = Blockly.derivWorkspace.getToolbox();
        const selected_category = toolbox.getSelectedItem();
        this.xml_list = toolbox.getCategoryContents(selected_category);
        this.xml_list_group = this.groupBy(this.xml_list, true);

        this.setHelpContent(block_node);
    }

    @action.bound
    updateSequenceButtons() {
        const current_block = this.xml_list.find(xml => xml.getAttribute('type') === this.block_type);
        const current_index = Object.keys(this.xml_list_group).findIndex(
            key => current_block.getAttribute('type') === key
        );
        this.should_previous_disable = current_index === 0;
        this.should_next_disable = current_index === Object.keys(this.xml_list_group).length - 1;
    }

    // eslint-disable-next-line
    groupBy(nodes, should_include_block_only = false) {
        return nodes.reduce(function(block_group, node) {
            const type = node.getAttribute('type');

            if (should_include_block_only && type === null) {
                return block_group;
            }

            if (!block_group[type]) {
                block_group[type] = [];
            }

            if (!should_include_block_only || (should_include_block_only && type !== null)) {
                block_group[type].push(node);
            }

            return block_group;
        }, {});
    }
}
