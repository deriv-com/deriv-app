import React from 'react';
import { Icon, Popover } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { popover_zindex } from 'Constants/z-indexes';

type TToolbarIcon = {
    popover_message: string;
    icon: string;
    icon_id: string;
    action: () => void;
    icon_color?: string;
    data_testid?: string;
};

const ToolbarIcon = ({ popover_message, icon, icon_id, icon_color, action, data_testid }: TToolbarIcon) => {
    const renderIcon = () => (
        <Icon
            icon={icon}
            id={icon_id}
            className='toolbar__icon'
            onClick={action}
            {...(icon_color && { color: icon_color })}
            data_testid={data_testid}
        />
    );

    if (isMobile()) {
        return renderIcon();
    }

    return (
        <Popover
            alignment='bottom'
            message={popover_message}
            zIndex={popover_zindex.TOOLBAR}
            should_disable_pointer_events
        >
            {renderIcon()}
        </Popover>
    );
};

export default ToolbarIcon;
