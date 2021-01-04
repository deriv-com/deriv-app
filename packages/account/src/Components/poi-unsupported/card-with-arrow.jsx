import React from 'react';
import { Icon, Text } from '@deriv/components';

const card_inside_style = {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'flex-start',
    userSelect: 'none',
};

const start_align_style = {
    margin: '0 0 0 2rem',
    width: '100%',
};

const CardWithArrow = ({ onClick, title, description, icon }) => {
    return (
        <div style={card_inside_style} onClick={onClick}>
            <Icon icon={icon} size={64} />
            <div style={start_align_style}>
                <Text as='p' weight='bold' color='prominent'>
                    {title}
                </Text>
                <Text as='p' size='xxs'>
                    {description}
                </Text>
            </div>

            <Icon icon='IcChevronRight' size={24} />
        </div>
    );
};

export { CardWithArrow };
