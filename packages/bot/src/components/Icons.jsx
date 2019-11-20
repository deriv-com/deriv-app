import React                   from 'react';
import classNames              from 'classnames';

// General
import general_logo            from '../assets/icons/ic-logo.svg';
import general_trade_active    from '../assets/icons/ic-trade-active.svg';
import general_info_blue       from '../assets/icons/icon-info-blue.svg';
import general_info_outline    from '../assets/icons/icon-info-outline.svg';
import general_run_icon        from '../assets/icons/run-icon.svg';
import general_stop_icon       from '../assets/icons/stop-icon.svg';

// Toolbar
import toolbar_drive           from '../assets/icons/google-drive-active.svg';
import toolbar_close           from '../assets/icons/ic-close.svg';
import toolbar_rename          from '../assets/icons/ic-rename.svg';
import toolbar_start           from '../assets/icons/ic-start.svg';
import toolbar_search          from '../assets/icons/ic-search.svg';
import toolbar_newFile         from '../assets/icons/new-file.svg';
import toolbar_open            from '../assets/icons/open.svg';
import toolbar_run             from '../assets/icons/performance-window.svg';
import toolbar_rearrange       from '../assets/icons/rearrange.svg';
import toolbar_redo            from '../assets/icons/redo.svg';
import toolbar_save            from '../assets/icons/save.svg';
import toolbar_local           from '../assets/icons/shape.svg';
import toolbar_undo            from '../assets/icons/undo.svg';
import toolbar_zoomIn          from '../assets/icons/zoom-in.svg';
import toolbar_zoomOut         from '../assets/icons/zoom-out.svg';
import toolbar_stop            from '../assets/icons/ic-toolbar-stop.svg';

// Toolbox
import toolbox_stage1          from '../assets/icons/ic-stage-1.svg';
import toolbox_stage2          from '../assets/icons/ic-stage-2.svg';
import toolbox_stage3          from '../assets/icons/ic-stage-3.svg';
import toolbox_stage4          from '../assets/icons/ic-stage-4.svg';
import toolbox_arrow1          from '../assets/icons/ic-arrow-1.svg';
import toolbox_arrow2          from '../assets/icons/ic-arrow-2.svg';

/* eslint-disable react/display-name */
export const Icon = svgItem => (props) => {
    const { className, onClick } = props;
    const [width, height] = svgItem.viewBox.split(' ').slice(2);

    return (
        <svg width={width} height={height} className={classNames('icon', className)} onClick={onClick}>
            <use xlinkHref={`${__webpack_public_path__}bot-sprite.svg#${svgItem.id}`} />
        </svg>
    );
};

export const preloadSprite = () => {
    const sprite = new Image();
    sprite.src = `${__webpack_public_path__}bot-sprite.svg`;
};

// General
export const LogoIcon              = Icon(general_logo);
export const TradeActive           = Icon(general_trade_active);
export const BlueInfoIcon          = Icon(general_info_blue);
export const InfoOutlineIcon       = Icon(general_info_outline);
export const RunIcon               = Icon(general_run_icon);
export const StopIcon              = Icon(general_stop_icon);

// Toolbox
export const Stage1Icon            = Icon(toolbox_stage1);
export const Stage2Icon            = Icon(toolbox_stage2);
export const Stage3Icon            = Icon(toolbox_stage3);
export const Stage4Icon            = Icon(toolbox_stage4);
export const Arrow1Icon            = Icon(toolbox_arrow1);
export const Arrow2Icon            = Icon(toolbox_arrow2);

// Toolbar
export const ToolbarStartIcon        = Icon(toolbar_start);
export const ToolbarSearchIcon       = Icon(toolbar_search);
export const ToolbarRenameIcon       = Icon(toolbar_rename);
export const ToolbarCloseIcon        = Icon(toolbar_close);
export const ToolbarOpenIcon         = Icon(toolbar_open);
export const ToolbarNewFileIcon      = Icon(toolbar_newFile);
export const ToolbarSaveIcon         = Icon(toolbar_save);
export const ToolbarUndoIcon         = Icon(toolbar_undo);
export const ToolbarRedoIcon         = Icon(toolbar_redo);
export const ToolbarRunIcon          = Icon(toolbar_run);
export const ToolbarStopIcon         = Icon(toolbar_stop);
export const ToolbarReaarangeIcon    = Icon(toolbar_rearrange);
export const ToolbarZoomInIcon       = Icon(toolbar_zoomIn);
export const ToolbarZoomOutIcon      = Icon(toolbar_zoomOut);
export const ToolbarLocalIcon        = Icon(toolbar_local);
export const ToolbarDriveIcon        = Icon(toolbar_drive);

