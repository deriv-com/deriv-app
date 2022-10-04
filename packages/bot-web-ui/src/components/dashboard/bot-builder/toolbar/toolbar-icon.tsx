import React from 'react';
import { popover_zindex } from 'Constants/z-indexes';
import { Icon, Popover } from '@deriv/components';

type TToolbarIcon = {
    popover_message: string;
    icon: string;
    icon_id: string;
    iconOnClick: () => void;
    icon_color?: string;
};

const ToolbarIcon = ({ popover_message, icon, icon_id, icon_color, iconOnClick }: TToolbarIcon) => (
    <Popover alignment='bottom' message={popover_message} zIndex={popover_zindex.TOOLBAR} should_disable_pointer_events>
        <Icon
            icon={icon}
            id={icon_id}
            className='toolbar__icon'
            onClick={iconOnClick}
            {...(icon_color ? { color: icon_color } : null)}
        />
    </Popover>
);

export default ToolbarIcon;
