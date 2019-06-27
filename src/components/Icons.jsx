import React        from 'react';
import arrow        from '../assets/icons/ic-arrow.svg';
import logo         from '../assets/icons/ic-logo.svg';
import tradeActive  from '../assets/icons/ic-trade-active.svg';

/* eslint-disable react/display-name */
export const Icon = svgItem => (props) => {
    const { className } = props;
    const vb = svgItem.viewBox.split(' ').slice(2);

    return (
        <svg width={vb[0]} height={vb[1]} className={`icon icon-${className}`}>
            <use xlinkHref={`./dist/bot-sprite.svg#${svgItem.id}`} />
        </svg>
    );
};

export const LogoIcon = Icon(logo);
export const TradeActive = Icon(tradeActive);
export const ArrowIcon = Icon(arrow);
