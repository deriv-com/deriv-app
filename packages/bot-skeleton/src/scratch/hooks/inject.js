/* eslint-disble */
/**
 * Create a main workspace and add it to the SVG.
 * @param {!Element} svg SVG element with pattern defined.
 * @param {!Blockly.Options} options Dictionary of options.
 * @param {!Blockly.BlockDragSurfaceSvg} blockDragSurface Drag surface SVG
 *     for the blocks.
 * @param {!Blockly.WorkspaceDragSurfaceSvg} workspaceDragSurface Drag surface
 *     SVG for the workspace.
 * @return {!Blockly.Workspace} Newly created main workspace.
 * @private
 */
Blockly.createVirtualWorkspace_ = function (fragment, options, blockDragSurface, workspaceDragSurface) {
    options.parentWorkspace = null;
    const mainWorkspace = new Blockly.WorkspaceSvg(options, blockDragSurface, workspaceDragSurface);
    mainWorkspace.scale = options.zoomOptions.startScale;
    fragment.appendChild(mainWorkspace.createDom('blocklyMainBackground'));

    return mainWorkspace;
};
