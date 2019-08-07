import React        from 'react';
import arrow        from '../assets/icons/ic-arrow.svg';
import logo         from '../assets/icons/ic-logo.svg';
import tradeActive  from '../assets/icons/ic-trade-active.svg';
import stage1       from '../assets/icons/ic-stage-1.svg';
import stage2       from '../assets/icons/ic-stage-2.svg';
import stage3       from '../assets/icons/ic-stage-3.svg';
import stage4       from '../assets/icons/ic-stage-4.svg';

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
export const Stage1Icon = Icon(stage1);
export const Stage2Icon = Icon(stage2);
export const Stage3Icon = Icon(stage3);
export const Stage4Icon = Icon(stage4);
