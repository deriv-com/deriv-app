/* eslint-disable no-underscore-dangle */
import React                  from 'react';
import { observable, action } from 'mobx';
import FlyoutBlock            from '../components/flyout-block.jsx';

export default class FlyoutStore {
    block_workspaces = [];
    listeners = [];
    is_positioned = false;
    flyout_min_width = 400;

    @observable is_visible = false;
    @observable toolbox_bounds = {};
    @observable flyout_content = [];
    @observable flyout_width = this.flyout_min_width;

    /**
     * Position the flyout next to the toolbox.
     * @memberof FlyoutStore
     */
    @action.bound positionFlyout() {
        const el_toolbox = document.querySelector('.toolbox');
        this.toolbox_bounds = el_toolbox.getBoundingClientRect();
        this.is_positioned = true;
    }

    /**
     * Parses XML contents passed by Blockly.Toolbox. Supports all default
     * Blockly elements i.e. <block>, <label>, <button>
     * @param {*} xmlList
     * @memberof FlyoutStore
     */
    @action.bound setContents(xmlList) {
        this.block_workspaces.forEach(workspace => workspace.dispose());
        this.block_workspaces = [];
        this.listeners.forEach(listener => Blockly.unbindEvent_(listener));
        this.listeners = [];

        const flyout_components = [];

        xmlList.forEach((node, index) => {
            const tagName = node.tagName.toUpperCase();

            if (tagName === 'BLOCK') {
                const key = node.getAttribute('type') + index;
                flyout_components.push(
                    <FlyoutBlock
                        key={key}
                        id={`flyout__item-workspace--${index}`}
                        block_node={node}
                        onInfoClick={() => alert('Hello')}
                    />
                );
            } else if (tagName === 'LABEL') {
                const key = node.getAttribute('text') + index;
                flyout_components.push(
                    <div key={key} className='flyout__item-label'>
                        { node.getAttribute('text') }
                    </div>
                );
            } else if (tagName === 'BUTTON') {
                const callbackKey = node.getAttribute('callbackKey');
                const callback = Blockly.derivWorkspace.getButtonCallback(callbackKey) || (() => {});
                const key = callbackKey + index;

                flyout_components.push(
                    <button
                        key={key}
                        className='flyout__item-button'
                        onClick={(button) => {
                            const b = button;

                            // Workaround for not having a flyout workspace.
                            b.targetWorkspace_ = Blockly.derivWorkspace;
                            b.getTargetWorkspace = () => b.targetWorkspace_;
                            callback(b);
                        }}
                    >
                        {node.getAttribute('text')}
                    </button>
                );
            }
        });

        this.flyout_width = Math.max(this.flyout_min_width, this.constructor.getLongestBlockWidth(xmlList) + 60);
        this.flyout_content.replace(flyout_components);
        this.setVisibility(true);
    }

    /**
     * Sets whether the flyout is visible or not.
     * @param {*} is_visible
     * @memberof FlyoutStore
     */
    @action.bound setVisibility(is_visible) {
        this.is_visible = is_visible;

        if (!is_visible) {
            this.flyout_content.clear();
        } else if (!this.is_positioned) {
            this.positionFlyout();
        }
    }

    /**
     * Intialises a workspace unique to the passed block_node
     * @param {*} container_div Containing div for the Blockly.Workspace
     * @param {*} block_node XML DOM of a Blockly.Block
     * @memberof FlyoutStore
     */
    @action.bound initBlockWorkspace(el_block_workspace, block_node) {
        const workspace = Blockly.inject(el_block_workspace, {
            media: 'dist/media/',
            move : {
                scrollbars: false,
                drag      : false,
                wheel     : false,
            },
            sounds: false,
        });

        const block = Blockly.Xml.domToBlock(block_node, workspace);
        // Some blocks have hats, consider their height.
        const extra_spacing = (block.startHat_ ? Blockly.BlockSvg.START_HAT_HEIGHT : 0);
        const block_workspace_height = Number.parseInt(block_node.getAttribute('height')) + extra_spacing + 10;

        // Update flyout and block-workspaces width to accommodate block widths.
        el_block_workspace.style.height = `${block_workspace_height}px`;
        el_block_workspace.style.width = `${this.flyout_width - 55}px`;

        // Give block some space on left and top.
        const dx = 1;
        const dy = 5 + extra_spacing;

        block.moveBy(dx, dy);

        // Use original Blockly flyout functionality to create block on drag.
        const blockly_flyout = Blockly.derivWorkspace.toolbox_.flyout_;

        this.listeners.push(
            Blockly.bindEventWithChecks_(block.getSvgRoot(), 'mousedown', null, (event) => {
                blockly_flyout.blockMouseDown_(block)(event);
            })
        );

        this.block_workspaces.push(workspace);
        // Resize all known workspaces. This may be inefficient.
        this.block_workspaces.forEach(block_workspace => Blockly.svgResize(block_workspace));
    }

    /**
     * Creates a copy of the block on the workspace and positions it
     * below the last block on the main workspace.
     * @param {*} block_node
     * @memberof FlyoutStore
     */
    static onAddClick(block_node) {
        const block = Blockly.Xml.domToBlock(block_node, Blockly.derivWorkspace);
        const top_blocks = Blockly.derivWorkspace.getTopBlocks(true);

        if (top_blocks.length) {
            const last_block = top_blocks[top_blocks.length - 1];
            const last_block_xy = last_block.getRelativeToSurfaceXY();
            const extra_spacing = last_block.startHat_ ? Blockly.BlockSvg.START_HAT_HEIGHT : 0;
            const y = last_block_xy.y + last_block.getHeightWidth().height + extra_spacing + 30;
            
            block.moveBy(last_block_xy.x, y);
        }

        Blockly.derivWorkspace.centerOnBlock(block.id, false);
        
    }

    static getLongestBlockWidth(xmlList) {
        const temp_workspace_container = document.createElement('div');
        document.children[0].append(temp_workspace_container);

        const temp_workspace = Blockly.inject(temp_workspace_container, {});
        let longest_block_width = 0;

        xmlList.forEach((node) => {
            const tagName = node.tagName.toUpperCase();
            if (tagName === 'BLOCK') {
                const block = Blockly.Xml.domToBlock(node, temp_workspace);
                const block_hw = block.getHeightWidth();

                node.setAttribute('width', block_hw.width);
                node.setAttribute('height', block_hw.height);
                longest_block_width = Math.max(longest_block_width, block_hw.width);
            }
        });
        
        temp_workspace.dispose();
        temp_workspace_container.parentNode.removeChild(temp_workspace_container);

        return longest_block_width;
    }
}
