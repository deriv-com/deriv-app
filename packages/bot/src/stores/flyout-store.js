/* eslint-disable no-underscore-dangle */
import React from 'react';
import { observable, action } from 'mobx';
import FlyoutBlock from '../components/flyout-block.jsx';

export default class FlyoutStore {
    block_listeners = [];
    block_workspaces = [];
    flyout_min_width = 400;

    @observable flyout_content = [];
    @observable flyout_width = this.flyout_min_width;
    @observable is_visible = false;

    /**
     * Sets whether the flyout is visible or not.
     * @param {boolean} is_visible
     * @memberof FlyoutStore
     */
    @action.bound setVisibility(is_visible) {
        this.is_visible = is_visible;

        if (!is_visible) {
            this.flyout_content = [];
        }
    }

    /**
     * Intialises a workspace unique to the passed block_node
     * @param {Element} el_block_workspace Element where Blockly.Workspace will be mounted on
     * @param {Element} block_node DOM of a Blockly.Block
     * @memberof FlyoutStore
     */
    @action.bound initBlockWorkspace(el_block_workspace, block_node) {
        const workspace = Blockly.inject(el_block_workspace, {
            css   : false,
            media : 'dist/media/',
            move  : { scrollbars: true, drag: true, wheel: true },
            sounds: false,
        });

        workspace.isFlyout = true;
        workspace.targetWorkspace = Blockly.derivWorkspace;

        const block = Blockly.Xml.domToBlock(block_node, workspace);

        block.isInFlyout = true;

        // Some blocks have hats, consider their height.
        const extra_spacing = (block.startHat_ ? Blockly.BlockSvg.START_HAT_HEIGHT : 0);
        const block_workspace_height = Number.parseInt(block_node.getAttribute('height')) + extra_spacing + 10;

        // Update block workspace widths to accommodate block widths.
        el_block_workspace.style.height = `${block_workspace_height}px`;
        el_block_workspace.style.width = `${this.flyout_width - 55}px`;

        // Move block away from side so it's displayed completely.
        const dx = 1;
        const dy = 5 + extra_spacing;

        block.moveBy(dx, dy);

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

            const tagName = node.tagName.toUpperCase();

            if (tagName === 'BLOCK') {
                const block_hw = Blockly.Block.getDimensions(node);

                node.setAttribute('width', block_hw.width);
                node.setAttribute('height', block_hw.height);

                longest_block_width = Math.max(longest_block_width, block_hw.width);
            }
        });
        this.flyout_width = Math.max(this.flyout_min_width, longest_block_width + 60);
    }

    @action.bound showHelpContent(block_node) {
        Object.keys(block_node).forEach(key => {
            const node = block_node[key];
            const block_hw = Blockly.Block.getDimensions(node);
    
            node.setAttribute('width', block_hw.width);
            node.setAttribute('height', block_hw.height);
        });

        const block_type = Blockly.Blocks[block_node[0].getAttribute('type')];

        if (typeof block_type.helpContent === 'undefined') {
            return;
        }

        const HelpComponent = block_type.helpContent();

        const help_content = (
            <React.Suspense key={block_type} fallback={<div>Loading...</div>}>
                <HelpComponent block_node={block_node} />
            </React.Suspense>
        );

        this.flyout_width = 600;
        this.flyout_content = [help_content];

    }

    @action.bound onSequenceClick(block_name, type) {
        const selected_category = Blockly.derivWorkspace.toolbox_.getSelectedItem();
        const xml_list = Blockly.Toolbox.getContent(selected_category, Blockly.derivWorkspace);

        const current_block = xml_list.find(xml => xml.getAttribute('type') === block_name);
        const last_position = xml_list.length - 1;

        let current_block_position = xml_list.indexOf(current_block);

        const checkIfBlock = (current_position) => {
            let current_pos = current_position;
            if (current_pos >= 0 &&
                current_pos < last_position &&
                xml_list[current_pos].tagName.toUpperCase() !== 'BLOCK') {
                if (type === 'next') {
                    current_pos += 1;
                } else if (type === 'previous') {
                    current_pos -= 1;
                }
            }

            return current_pos;
        };

        const adjustIndexOutofBound = (current_position, last) => {
            let current_pos = current_position;
            if (current_pos < 0) {
                current_pos = last;
            } else if (current_pos > last) {
                current_pos = 0;
            }

            return current_pos;
        };

        if (type === 'next') {
            current_block_position += 1;

            current_block_position = adjustIndexOutofBound(current_block_position, last_position);
            current_block_position = checkIfBlock(current_block_position);
        } else if (type === 'previous') {
            current_block_position -= 1;

            current_block_position = checkIfBlock(current_block_position);
            current_block_position = adjustIndexOutofBound(current_block_position, last_position);
        }

        const target_block = xml_list[current_block_position];
        const xml_list_group = this.groupBy(xml_list);

        let target_blocks = [];
        // eslint-disable-next-line
        Object.keys(xml_list_group).forEach(key => {
            const blocks = xml_list_group[key];

            if (blocks.indexOf(target_block) > -1){
                target_blocks = blocks;
            }
        });
        this.showHelpContent(target_blocks);
    }

    static onBackClick() {
        const toolbox = Blockly.derivWorkspace.toolbox_;
        const category = Blockly.derivWorkspace.toolbox_.getSelectedItem();

        toolbox.setSelectedItem(category, false);
    }

    /**
     * Parses XML contents passed by Blockly.Toolbox. Supports all default
     * Blockly.Flyout elements i.e. <block>, <label>, <button> in their
     * original format, e.g. <label text="Hello World" />
     * @param {Element[]} xmlList list of XML nodes
     * @memberof FlyoutStore
     */
    @action.bound setContents(xmlList) {
        this.block_listeners.forEach(listener => Blockly.unbindEvent_(listener));
        this.block_workspaces.forEach(workspace => workspace.dispose());

        const flyout_components = [];

        const xml_list_group = this.groupBy(xmlList);

        Object.keys(xml_list_group).forEach((key, index) => {
            const nodes = xml_list_group[key];
            const first_block = nodes[0];
            const tagName = first_block.tagName.toUpperCase();

            if (tagName === 'BLOCK') {
                const block_type = first_block.getAttribute('type');
                const unique_key = block_type + Math.random();

                flyout_components.push(
                    <FlyoutBlock
                        key={unique_key}
                        id={`flyout__item-workspace--${index}`}
                        block_node={nodes}
                        onInfoClick={
                            Blockly.Blocks[block_type].helpContent
                            && (() => this.showHelpContent(nodes))
                        }
                    />
                );
            } else if (tagName === 'LABEL') {
                Object.keys(nodes).forEach(node_key => {
                    const node = nodes[node_key];
                    const unique_key = node.getAttribute('text') + index;

                    flyout_components.push(
                        <div key={unique_key} className='flyout__item-label'>
                            {node.getAttribute('text')}
                        </div>
                    );
                });
            } else if (tagName === 'BUTTON') {
                Object.keys(nodes).forEach(node_key => {
                    const node = nodes[node_key];
                    const callbackKey = node.getAttribute('callbackKey');
                    const callback = Blockly.derivWorkspace.getButtonCallback(callbackKey) || (() => { });
                    const unique_key = callbackKey + index;

                    flyout_components.push(
                        <button
                            key={unique_key}
                            className='flyout__button'
                            onClick={(button) => {
                                const flyout_button = button;

                                // Workaround for not having a flyout workspace.
                                flyout_button.targetWorkspace_ = Blockly.derivWorkspace;
                                flyout_button.getTargetWorkspace = () => flyout_button.targetWorkspace_;

                                callback(flyout_button);
                            }}
                        >
                            {node.getAttribute('text')}
                        </button>
                    );
                });
            }
        });

        this.flyout_content = flyout_components;
        this.setVisibility(true);
        this.setFlyoutWidth(xmlList);
    }

    groupBy = function(nodes) {
        return nodes.reduce(function (groupKey, node) {
            (groupKey[node.getAttribute('type')] = groupKey[node.getAttribute('type')] || []).push(node);
            return groupKey;
        }, {});
    };

    /**
 * Creates a copy of passed block_node on main workspace and positions it
 * below the lowest block.
 * @static
 * @param {Element} block_node
 * @memberof FlyoutStore
 */
    static onAddClick(block_node) {
        const block = Blockly.Xml.domToBlock(block_node, Blockly.derivWorkspace);
        const top_blocks = Blockly.derivWorkspace.getTopBlocks(true);

        if (top_blocks.length) {
            const last_block = top_blocks[top_blocks.length - 1];
            const last_block_xy = last_block.getRelativeToSurfaceXY();
            const extra_spacing = (last_block.startHat_ ? Blockly.BlockSvg.START_HAT_HEIGHT : 0);
            const y = last_block_xy.y + last_block.getHeightWidth().height + extra_spacing + 30;

            block.moveBy(last_block_xy.x, y);
        }

        Blockly.derivWorkspace.centerOnBlock(block.id, false);
    }
}
