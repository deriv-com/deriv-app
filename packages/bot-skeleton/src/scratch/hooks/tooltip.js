import { blueInfo } from '../blocks/images';

Blockly.Tooltip.HOVER_MS = 50;

Blockly.Tooltip.show_ = () => {
    let params;
    Blockly.Tooltip.DIV = ((Blockly.Tooltip.poisonedElement_ = Blockly.Tooltip.element_), Blockly.Tooltip.DIV);
    if (!Blockly.Tooltip.blocked_) {
        Blockly.Tooltip.DIV.innerHTML = '';
        for (params = Blockly.Tooltip.element_.tooltip; typeof params === 'function'; ) params = params();
        params = Blockly.utils.string.wrap(params, Blockly.Tooltip.LIMIT);
        params = params.split('\n');

        params.forEach((param, index) => {
            const div = document.createElement('div');
            const text_span = document.createElement('span');

            text_span.appendChild(document.createTextNode(param));
            text_span.style.verticalAlign = 'middle';
            Blockly.Tooltip.DIV.appendChild(div);

            if (!index) {
                const img = document.createElement('img');
                const img_span = document.createElement('span');
                img.src = blueInfo;
                img.style.paddingRight = '8px';
                img.style.verticalAlign = 'middle';
                div.appendChild(img_span);
                img_span.appendChild(img);
            } else {
                text_span.style.paddingLeft = '24px';
            }

            div.appendChild(text_span);
        });

        const direction = Blockly.Tooltip.element_.RTL;
        const client_width = document.documentElement.clientWidth;
        const client_height = document.documentElement.clientHeight;
        if (Blockly.Tooltip.DIV) {
            Blockly.Tooltip.DIV.style.direction = direction ? 'rtl' : 'ltr';
        }
        Blockly.Tooltip.DIV.style.display = 'block';
        Blockly.Tooltip.visible = true;
        let last_x = Blockly.Tooltip.lastX_;
        last_x = direction
            ? last_x - (Blockly.Tooltip.OFFSET_X + Blockly.Tooltip.DIV.offsetWidth)
            : last_x + Blockly.Tooltip.OFFSET_X;
        let last_y = Blockly.Tooltip.lastY_ + Blockly.Tooltip.OFFSET_Y;
        if (last_y + Blockly.Tooltip.DIV.offsetHeight > client_height + window.scrollY) {
            last_y -= Blockly.Tooltip.DIV.offsetHeight + 2 * Blockly.Tooltip.OFFSET_Y;
        }
        if (direction) {
            last_x = Math.max(Blockly.Tooltip.MARGINS - window.scrollX, last_x);
        }
        if (last_x + Blockly.Tooltip.DIV.offsetWidth > client_width + window.scrollX - 2 * Blockly.Tooltip.MARGINS) {
            last_x = client_width - Blockly.Tooltip.DIV.offsetWidth - 2 * Blockly.Tooltip.MARGINS;
        }
        Blockly.Tooltip.DIV.style.top = `${last_y}px`;
        Blockly.Tooltip.DIV.style.left = `${last_x}px`;
    }
};

Blockly.Tooltip.hide = () => {
    if (Blockly.Tooltip.visible && Blockly.Tooltip.DIV) {
        Blockly.Tooltip.visible = false;
        setTimeout(() => (Blockly.Tooltip.DIV.style.display = 'none'), Blockly.Tooltip.HOVER_MS);
    }
    if (Blockly.Tooltip.showPid_) {
        clearTimeout(Blockly.Tooltip.showPid_);
    }

    /// For hiding tooltip next to the platform name.
    if (!Blockly.Tooltip.DIV?.style.direction) {
        Blockly.Tooltip.visible = false;
        Blockly.Tooltip.DIV.style.display = 'none';
    }
};
