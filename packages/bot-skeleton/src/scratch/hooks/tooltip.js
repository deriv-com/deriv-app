import { blueInfo } from '../blocks/images';

Blockly.Tooltip.HOVER_MS = 50;

Blockly.Tooltip.show_ = function() {
    let param;
    Blockly.Tooltip.DIV = ((Blockly.Tooltip.poisonedElement_ = Blockly.Tooltip.element_), Blockly.Tooltip.DIV);
    if (!Blockly.Tooltip.blocked_) {
        Blockly.Tooltip.DIV.innerHTML = '';
        for (param = Blockly.Tooltip.element_.tooltip; typeof param === 'function'; ) param = param();
        param = Blockly.utils.string.wrap(param, Blockly.Tooltip.LIMIT);
        param = param.split('\n');
        for (let counter = 0; counter < param.length; counter++) {
            const div = document.createElement('div');
            const img = document.createElement('img');
            const img_span = document.createElement('span');
            const text_span = document.createElement('span');

            text_span.appendChild(document.createTextNode(param[counter]));
            img.src = blueInfo;
            img.style.paddingRight = '8px';
            text_span.style.verticalAlign = 'middle';
            img.style.verticalAlign = 'middle';

            Blockly.Tooltip.DIV.appendChild(div);
            div.appendChild(img_span);
            img_span.appendChild(img);
            div.appendChild(text_span);
        }
        param = Blockly.Tooltip.element_.RTL;
        const client_width = document.documentElement.clientWidth;
        const client_height = document.documentElement.clientHeight;
        Blockly.Tooltip.DIV.style.direction = param ? 'rtl' : 'ltr';
        Blockly.Tooltip.DIV.style.display = 'block';
        Blockly.Tooltip.visible = !0;
        let last_x = Blockly.Tooltip.lastX_;
        last_x = param
            ? last_x - (Blockly.Tooltip.OFFSET_X + Blockly.Tooltip.DIV.offsetWidth)
            : last_x + Blockly.Tooltip.OFFSET_X;
        let last_y = Blockly.Tooltip.lastY_ + Blockly.Tooltip.OFFSET_Y;
        if (last_y + Blockly.Tooltip.DIV.offsetHeight > client_height + window.scrollY) {
            last_y -= Blockly.Tooltip.DIV.offsetHeight + 2 * Blockly.Tooltip.OFFSET_Y;
        }
        if (param) {
            last_x = Math.max(Blockly.Tooltip.MARGINS - window.scrollX, last_x);
        }
        if (last_x + Blockly.Tooltip.DIV.offsetWidth > client_width + window.scrollX - 2 * Blockly.Tooltip.MARGINS) {
            last_x = client_width - Blockly.Tooltip.DIV.offsetWidth - 2 * Blockly.Tooltip.MARGINS;
        }
        Blockly.Tooltip.DIV.style.top = `${last_y}px`;
        Blockly.Tooltip.DIV.style.left = `${last_x}px`;
    }
};

Blockly.Tooltip.hide = function() {
    if (Blockly.Tooltip.visible && Blockly.Tooltip.DIV) {
        Blockly.Tooltip.visible = !1;
        setTimeout(() => (Blockly.Tooltip.DIV.style.display = 'none'), Blockly.Tooltip.HOVER_MS);
    }
    if (Blockly.Tooltip.showPid_) {
        clearTimeout(Blockly.Tooltip.showPid_);
    }
};
