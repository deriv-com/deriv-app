/**
 * Create the input shape path element and attach it to the given SVG element.
 * @param {!SVGElement} svgRoot The parent on which ot append the new element.
 * @package
 */
Blockly.Input.prototype.initOutlinePath = function(svgRoot) {
    if (!this.sourceBlock_.workspace.rendered) {
        return;  // Headless blocks don't need field outlines.
    }
    if (this.outlinePath) {
        return;
    }
    if (this.type === Blockly.INPUT_VALUE) {
        this.outlinePath = Blockly.utils.createSvgElement(
            'path',
            {
                'class': 'rofl',
                'd'    : '',  // IE doesn't like paths without the data definition, set an empty default
            },
            svgRoot);
    }
};
