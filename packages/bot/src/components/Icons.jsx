import classNames      from 'classnames';
import React            from 'react';
import drive            from '../assets/icons/google-drive-active.svg';
import arrow1           from '../assets/icons/ic-arrow-1.svg';
import arrow2           from '../assets/icons/ic-arrow-2.svg';
import logo             from '../assets/icons/ic-logo.svg';
import tradeActive      from '../assets/icons/ic-trade-active.svg';
import stage1           from '../assets/icons/ic-stage-1.svg';
import stage2           from '../assets/icons/ic-stage-2.svg';
import stage3           from '../assets/icons/ic-stage-3.svg';
import stage4           from '../assets/icons/ic-stage-4.svg';
import blueInfo         from '../assets/icons/icon-info-blue.svg';
import start            from '../assets/icons/ic-start.svg';
import search           from '../assets/icons/ic-search.svg';
import rename           from '../assets/icons/ic-rename.svg';
import close            from '../assets/icons/ic-close.svg';
import open             from '../assets/icons/open.svg';
import newFile          from '../assets/icons/new-file.svg';
import save             from '../assets/icons/save.svg';
import undo             from '../assets/icons/undo.svg';
import redo             from '../assets/icons/redo.svg';
import performance      from '../assets/icons/performance-window.svg';
import rearrange        from '../assets/icons/rearrange.svg';
import zoomIn           from '../assets/icons/zoom-in.svg';
import zoomOut          from '../assets/icons/zoom-out.svg';
import local            from '../assets/icons/shape.svg';
import iconInfoOutline  from '../assets/icons/icon-info-outline.svg';

/* eslint-disable react/display-name */
export const Icon = svgItem => (props) => {
    const { className, onClick } = props;
    const [width, height] = svgItem.viewBox.split(' ').slice(2);

    return (
        <svg width={width} height={height} className={classNames('icon', { [className]: !!className }) } onClick={onClick}>
            { /* eslint-disable-next-line */ }
            <use xlinkHref={`${__webpack_public_path__}bot-sprite.svg#${svgItem.id}`} />
        </svg>
    );
};

export const LogoIcon           = Icon(logo);
export const TradeActive        = Icon(tradeActive);
export const Arrow1Icon         = Icon(arrow1);
export const Arrow2Icon         = Icon(arrow2);
export const Stage1Icon         = Icon(stage1);
export const Stage2Icon         = Icon(stage2);
export const Stage3Icon         = Icon(stage3);
export const Stage4Icon         = Icon(stage4);
export const BlueInfoIcon       = Icon(blueInfo);
export const IconInfoOutline    = Icon(iconInfoOutline);
// Toolbar
export const StartIcon      = Icon(start);
export const SearchIcon     = Icon(search);
export const RenameIcon     = Icon(rename);
export const CloseIcon      = Icon(close);
export const OpenIcon       = Icon(open);
export const NewFileIcon    = Icon(newFile);
export const SaveIcon       = Icon(save);
export const UndoIcon       = Icon(undo);
export const RedoIcon       = Icon(redo);
export const PerformIcon    = Icon(performance);
export const ReaarangeIcon  = Icon(rearrange);
export const ZoomInIcon     = Icon(zoomIn);
export const ZoomOutIcon    = Icon(zoomOut);
export const LocalIcon      = Icon(local);
export const DriveIcon      = Icon(drive);
