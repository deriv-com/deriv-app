/**
 * Install this text field on a block.
 */
// Blockly.FieldTextInput.prototype.init = function () {
    // if (this.fieldGroup_) {
    //     // Field has already been initialized once.
    //     return;
    // }

    // const notInShadow = !this.sourceBlock_.isShadow();

    // if (notInShadow) {
    //     this.className_ += ' blocklyEditableLabel';
    // }

    // this.maxDisplayLength = 17;

    // this.fieldGroup_ = new Blockly.FieldTextInput(this);

    // this.constants = new Blockly.blockRendering.ConstantProvider();
    // // If not in a shadow block, draw a box.
    // if (notInShadow) {
    //     this.box_ = Blockly.utils.dom.createSvgElement('rect', {
    //         rx: this.constants.CORNER_RADIUS * 4,
    //         ry: this.constants.CORNER_RADIUS * 4,
    //         x: 0,
    //         y: 0,
    //         width: this.size_.width,
    //         height: this.size_.height,
    //         fill: this.sourceBlock_.getColourSecondary(),
    //         stroke: this.sourceBlock_.getColourTertiary(),
    //         'stroke-width': '0.3px',
    //     });
    //     console.log({
    //         instance: this,
    //         fieldGroup_: this.fieldGroup_,
    //     })
    //     this.fieldGroup_.insertBefore(this.box_, this.textElement_);
    // }
// };