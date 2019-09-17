import React           from 'react';
import arrow1          from '../assets/icons/ic-arrow-1.svg';
import arrow2          from '../assets/icons/ic-arrow-2.svg';
import logo            from '../assets/icons/ic-logo.svg';
import tradeActive     from '../assets/icons/ic-trade-active.svg';
import stage1          from '../assets/icons/ic-stage-1.svg';
import stage2          from '../assets/icons/ic-stage-2.svg';
import stage3          from '../assets/icons/ic-stage-3.svg';
import stage4          from '../assets/icons/ic-stage-4.svg';
import blueInfo        from '../assets/icons/icon-info-blue.svg';
import iconInfoOutline from '../assets/icons/icon-info-outline.svg';
/* eslint-disable react/display-name */
export const Icon = svgItem => (props) => {
    const { className } = props;
    const [width, height] = svgItem.viewBox.split(' ').slice(2);

    return (
        <svg width={width} height={height} className={`icon ${className}`}>
            { /* eslint-disable-next-line */ }
            <use xlinkHref={`${__webpack_public_path__}bot-sprite.svg#${svgItem.id}`} />
        </svg>
    );
};

export const LogoIcon        = Icon(logo);
export const TradeActive     = Icon(tradeActive);
export const Arrow1Icon      = Icon(arrow1);
export const Arrow2Icon      = Icon(arrow2);
export const Stage1Icon      = Icon(stage1);
export const Stage2Icon      = Icon(stage2);
export const Stage3Icon      = Icon(stage3);
export const Stage4Icon      = Icon(stage4);
export const BlueInfoIcon    = Icon(blueInfo);
export const IconInfoOutline = Icon(iconInfoOutline);
