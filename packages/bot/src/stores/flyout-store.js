/* eslint-disable no-underscore-dangle */
import { observable, action }   from 'mobx';
import config                   from '../constants';

export default class FlyoutStore {
    block_listeners  = [];
    block_workspaces = [];
    flyout_min_width = 500;
    options          = {
        css   : false,
        media : `${__webpack_public_path__}media/`,
        move  : { scrollbars: false, drag: true, wheel: false },
        zoom  : { startScale: config.workspaces.flyoutWorkspacesStartScale },
        sounds: false,
    };

    @observable is_help_content = false;
    @observable flyout_content = [];
    @observable flyout_width = this.flyout_min_width;
    @observable is_visible = false;
    @observable is_search_flyout = false;
    @observable is_loading = false;
    @observable search_term = '';

    constructor(root_store) {
        this.root_store = root_store;
    }

    /**
     * Parses XML contents passed by Blockly.Toolbox. Supports all default
     * Blockly.Flyout elements i.e. <block>, <label>, <button> in their
     * original format, e.g. <label text="Hello World" />
     * @param {Element[]} xml_list list of XML nodes
     * @memberof FlyoutStore
     */
    @action.bound setContents(xml_list, search_term = '') {
        const text_limit = 20;
        const processed_xml = xml_list;
        this.block_listeners.forEach(listener => Blockly.unbindEvent_(listener));
        this.block_workspaces.forEach(workspace => workspace.dispose());
        this.block_listeners = [];
        this.block_workspaces = [];
        this.is_help_content = false;
        this.search_term = search_term.length > text_limit ? `${search_term.substring(0, text_limit)}...` : search_term;

        // const xml_list_group = this.groupBy(xml_list);

        this.flyout_content = observable(xml_list);
        this.setFlyoutWidth(processed_xml);
        this.setVisibility(true);

        // apparently setFlyoutWidth doesn't calculate blocks dimentions until they're visible
        // using setTimeout is a workaround to solve this issue
        // TODO: Find a proper solution
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
        if (this.is_visible === is_visible) {
            return;
        }

        this.is_visible = is_visible;

        if (!is_visible) {
            this.flyout_content = observable([]);
        }
    }

    /**
     * Sets whether the flyout is search or not.
     * @param {boolean} is_search
     * @memberof FlyoutStore
     */
    @action.bound setIsSearchFlyout(is_search) {
        this.is_search_flyout = is_search;
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
        el_block_workspace.style.width = `${Math.ceil(block_hw.width * this.options.zoom.startScale) + 1}px`;
        block.moveBy(1,1);

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

    /**
     * Close the flyout on click outside itself or parent toolbox.
     */
    @action.bound
    onClickOutsideFlyout(event) {
        if (!this.is_visible || !Blockly.derivWorkspace) {
            return;
        }

        const toolbox         = Blockly.derivWorkspace.toolbox_; // eslint-disable-line
        const is_flyout_click = event.path.some(el => el.classList && el.classList.contains('flyout'));
        const isToolboxClick  = () => toolbox.HtmlDiv.contains(event.target);

        if (!is_flyout_click && !isToolboxClick()) {
            toolbox.clearSelection();
        }
    }

    @action.bound
    onMount() {
        window.addEventListener('click', this.onClickOutsideFlyout);
    }

    @action.bound
    onUnmount() {
        window.removeEventListener('click', this.onClickOutsideFlyout);
    }
}
