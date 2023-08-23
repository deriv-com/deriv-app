import React from 'react';
import { Icon, Popover } from '@deriv/components';
import { popover_zindex } from 'Constants/z-indexes';

type TIconButton = {
    icon: string;
    icon_id: string;
    iconOnClick: () => void;
    icon_color?: string;
    popover_message: string;
};

const IconButton = ({ popover_message, icon, icon_id, icon_color, iconOnClick }: TIconButton) => {
    return (
        <Popover
            alignment='bottom'
            message={popover_message}
            zIndex={popover_zindex.TOOLBAR}
            should_disable_pointer_events
            data_testid='popover_message'
        >
            <Icon
                icon={icon}
                id={icon_id}
                className='toolbar__icon'
                onClick={iconOnClick}
                {...(icon_color ? { color: icon_color } : null)}
                data_testid='icon_button'
            />
        </Popover>
    );
};

export default IconButton;
