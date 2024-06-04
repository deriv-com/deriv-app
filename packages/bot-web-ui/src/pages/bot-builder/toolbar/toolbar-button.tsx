import React from 'react';
import { Button, Popover } from '@deriv/components';

type TToolbarButton = {
    popover_message?: string;
    button_id: string;
    button_classname: string;
    buttonOnClick: () => void;
    icon?: React.ReactElement;
    button_text: string;
};

const ToolbarButton = ({
    popover_message,
    button_id,
    button_classname,
    buttonOnClick,
    icon,
    button_text,
}: TToolbarButton) => (
    <Popover alignment='bottom' message={popover_message} should_disable_pointer_events>
        <Button id={button_id} className={button_classname} has_effect onClick={buttonOnClick} icon={icon} green>
            {button_text}
        </Button>
    </Popover>
);

export default ToolbarButton;
