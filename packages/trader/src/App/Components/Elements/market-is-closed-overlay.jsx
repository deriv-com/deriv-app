import React                  from 'react';
import { Button }             from 'deriv-components';
import { localize, Localize } from 'deriv-translations';

const toggleFade = ({ node, opacity, direction, color }) => {
    const sub_or_add = direction === -1 && opacity > 0.1 ? -1 : 1;
    let reduction = 0.05;
    if (opacity < 0.3 && opacity > 0.1) {
        reduction = 0.01;
    }
    const new_opacity = parseFloat(Number(opacity + (sub_or_add * reduction)).toFixed(2));

    node.style.backgroundColor = color.replace(`${opacity})`, `${Number(new_opacity).toFixed(2)})`);

    const stopId = requestAnimationFrame(toggleFade.bind(this,
        {
            node,
            opacity  : new_opacity,
            direction: sub_or_add,
            color    : node.style.backgroundColor,
        },
    ));
    if (new_opacity >= 1) {
        cancelAnimationFrame(stopId);
        // Set the initial value to follow CSS
        node.querySelectorAll('div')
            .forEach(element => {
                element.style.backgroundColor = '';
            });
        node.style.backgroundColor = '';
    }
};

const startAnimation = (node) => {
    const children_background_color = getComputedStyle(node.firstElementChild).getPropertyValue('background-color');
    const converted_rgba = children_background_color.startsWith('rgba') ?
        children_background_color :
        `rgba(${children_background_color
            .replace('rgb(', '')
            .replace(')', '')
            .split(', ')
            .join(',')},1)`;

    // Set initial value for individual rows
    node.querySelectorAll('div')
        .forEach(element => {
            element.style.backgroundColor = 'transparent';
        });
    node.style.backgroundColor = converted_rgba; // compensate for removal background of individual rows

    const direction            = -1; // lower the opacity
    requestAnimationFrame(toggleFade.bind(this,
        {
            node,
            opacity: 1,
            direction,
            color  : converted_rgba,
        },
    ));
};

/**
 * Handle animation for dropdown, this is imperative, with DOM manipulation.
 */
const onClick = () => {
    const dropdown = document.querySelector('.cq-menu-dropdown');
    if (dropdown.classList.contains('open')) return;
    document.querySelector('.cq-symbol-select-btn').click();
    const left_panel = document.querySelector('.cq-filter-panel');
    left_panel.querySelector('.ic-synthetic_index').parentNode.click();

    const node = document
        .querySelector('.category-synthetic_index')
        .querySelector('.category-content');
    setTimeout(startAnimation.bind(this, node), 600);
};

const MarketIsClosedOverlay = () => (
    <div className='market-is-closed-overlay'>
        <p><Localize i18n_default_text='Market is closed.' /></p>
        <p><Localize i18n_default_text='Try Synthetic Indices which simulate real-world market volatility and are open 24/7.' /></p>
        <Button
            className='market-is-closed-overlay__button'
            onClick={onClick}
            text={localize('Try Synthetic Indices')}
            primary
        />
    </div>
);

export default MarketIsClosedOverlay;
