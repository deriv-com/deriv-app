/* eslint-disable no-underscore-dangle */
import { observable, action } from 'mobx';
import config from '../constants/const';
import { translate } from '../utils/lang/i18n';

export default class FlyoutStore {
    block_listeners = [];
    block_workspaces = [];
    flyout_min_width = 400;
    options = {
        css   : false,
        media : `${__webpack_public_path__}media/`, // eslint-disable-line
        move  : { scrollbars: false, drag: true, wheel: false },
        zoom  : { startScale: config.workspaces.flyoutWorkspacesStartScale },
        sounds: false,
    };

    @observable is_help_content = false;
    @observable block_nodes = [];
    @observable flyout_content = [];
    @observable flyout_width = this.flyout_min_width;
    @observable is_visible = false;

    /**
     * Parses XML contents passed by Blockly.Toolbox. Supports all default
     * Blockly.Flyout elements i.e. <block>, <label>, <button> in their
     * original format, e.g. <label text="Hello World" />
     * @param {Element[]} xml_list list of XML nodes
     * @memberof FlyoutStore
     */
    @action.bound setContents(xml_list) {
        let processed_xml = xml_list;
        this.block_listeners.forEach(listener => Blockly.unbindEvent_(listener));
        this.block_workspaces.forEach(workspace => workspace.dispose());
        this.block_listeners = [];
        this.block_workspaces = [];
        this.is_help_content = false;

        if (xml_list.type === 'search') {
            const blocks = xml_list.blocks;
            const has_result = blocks.length;

            processed_xml = [];

            if (!has_result) {
                const label = document.createElement('label');
                label.setAttribute('text', translate('No Blocks Found'));

                processed_xml.push(label);
            } else {
                const label = document.createElement('label');
                label.setAttribute('text', translate('Result(s)'));

                processed_xml.push(label);
            }

            processed_xml = processed_xml.concat(blocks);
        }

        const xml_list_group = this.groupBy(processed_xml);

        this.flyout_content = observable(xml_list_group);
        this.setFlyoutWidth(processed_xml);
        this.setVisibility(true);

        // apparently setFlyoutWidth doesn't calculate blocks dimentions until they're visible
        // using setTimeout is a workaround to solve this issue
        const self = this;
        setTimeout(function() {
            self.setFlyoutWidth(processed_xml);
        }, 50);
    }

    /**
     * Sets whether the flyout is visible or not.
     * @param {boolean} is_visible
     * @memberof FlyoutStore
     */
    @action.bound setVisibility(is_visible) {
        this.is_visible = is_visible;

        if (!is_visible) {
            this.flyout_content = observable([]);
        }
    }

    /**
     * Intialises a workspace unique to the passed block_node
     * @param {Element} el_block_workspace Element where Blockly.Workspace will be mounted on
     * @param {Element} block_node DOM of a Blockly.Block
     * @memberof FlyoutStore
     */
    @action.bound initBlockWorkspace(el_block_workspace, block_node) {
        const workspace = Blockly.inject(el_block_workspace, this.options);

        workspace.isFlyout = true;
        workspace.targetWorkspace = Blockly.derivWorkspace;

        const block = Blockly.Xml.domToBlock(block_node, workspace);
        // Using block.getHeightWidth() here because getDimentions() also calls Blockly.Xml.domToBlock
        const block_hw = block.getHeightWidth();

        block.isInFlyout = true;

        // Update block workspace widths to accommodate block widths.
        // addind 1px to highet and then moving the block 1px down to make block top border visible
        el_block_workspace.style.height = `${Math.ceil(block_hw.height * this.options.zoom.startScale) + 1}px`;
        el_block_workspace.style.width = `${Math.ceil(block_hw.width * this.options.zoom.startScale)}px`;
        block.moveBy(0,1);

        // Use original Blockly flyout functionality to create block on drag.
        const blockly_flyout = Blockly.derivWorkspace.toolbox_.flyout_;

        this.block_listeners.push(
            Blockly.bindEventWithChecks_(block.getSvgRoot(), 'mousedown', null, (event) => {
                blockly_flyout.blockMouseDown_(block)(event);
            })
        );

        this.block_workspaces.push(workspace);
        this.block_workspaces.forEach(Blockly.svgResize);
    }

    /**
     * Walks through xmlList and finds width of the longest block while setting
     * height and width (in workspace pixels) attributes on each of the block nodes.
     * @param {Element[]} xmlList
     * @memberof FlyoutStore
     */
    @action.bound setFlyoutWidth(xmlList) {
        let longest_block_width = 0;

        xmlList.forEach((node) => {
            const tag_name = node.tagName.toUpperCase();
            
            if (tag_name === Blockly.Xml.NODE_BLOCK) {
                const block_hw = Blockly.Block.getDimensions(node);

                node.setAttribute('width', Math.ceil(block_hw.width * this.options.zoom.startScale));
                node.setAttribute('height', Math.ceil(block_hw.height * this.options.zoom.startScale));
                longest_block_width = Math.max(
                    longest_block_width,
                    Math.ceil(block_hw.width * this.options.zoom.startScale)
                );
            }
        });

        this.flyout_width = Math.max(this.flyout_min_width, longest_block_width + 65);
    }

    @action.bound async onSequenceClick(block_name, should_go_next) {
        const toolbox = Blockly.derivWorkspace.toolbox_;
        const selected_category = toolbox.getSelectedItem();
        const xml_list = toolbox.getCategoryContents(selected_category);
        const xml_list_group = this.groupBy(xml_list, true);
        const current_block = xml_list.find(xml => xml.getAttribute('type') === block_name);

        let current_block_index;

        Object.keys(xml_list_group).forEach((key, index) => {
            if (current_block.getAttribute('type') === key) {
                current_block_index = index;
            }
        });

        const getNextBlock = async (xml, currentIndex, direction) => {
            const nextIndex = currentIndex + (direction ? 1 : -1);
            const block_type = Object.keys(xml).find((key, index) => nextIndex === index);
            // eslint-disable-next-line consistent-return
            if (!block_type) return;
            try {
                await import(`../scratch/help-content/help-string/${block_type}.json`);
                // eslint-disable-next-line consistent-return
                return block_type;
            } catch (e) {
                // eslint-disable-next-line consistent-return
                return getNextBlock(xml,nextIndex,direction);
            }
        };

        const block_type = await getNextBlock(xml_list_group,current_block_index,should_go_next);
        if (block_type) {
            const target_blocks = xml_list_group[block_type];
            this.showHelpContent(target_blocks);
        }
    }

    @action.bound showHelpContent(block_node) {
        Object.keys(block_node).forEach(key => {
            const node = block_node[key];
            const block_hw = Blockly.Block.getDimensions(node);

            node.setAttribute('width', block_hw.width * this.options.zoom.startScale);
            node.setAttribute('height', block_hw.height * this.options.zoom.startScale);
        });

        this.flyout_width = 650;
        this.block_nodes = block_node;
        this.is_help_content = true;
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
