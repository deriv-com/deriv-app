import React from 'react';
import { popover_zindex } from 'Constants/z-indexes';
import { Icon, Popover } from '@deriv/components';

type TToolbarIcon = {
    popover_message: string;
    icon: string;
    icon_id: string;
    action: () => void;
    icon_color?: string;
};

const ToolbarIcon = ({ popover_message, icon, icon_id, icon_color, action }: TToolbarIcon) => (
    <Popover alignment='bottom' message={popover_message} zIndex={popover_zindex.TOOLBAR} should_disable_pointer_events>
        <Icon
            icon={icon}
            id={icon_id}
            className='toolbar__icon'
            onClick={action}
            {...(icon_color && { color: icon_color })}
        />
    </Popover>
);

export default ToolbarIcon;
