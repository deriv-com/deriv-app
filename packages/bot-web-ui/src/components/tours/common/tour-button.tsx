import React from 'react';

import { Text } from '@deriv/components';

type TTourButton = {
    type?: string;
    onClick: () => void;
    label: string;
};

const TourButton = ({ label, type = 'default', ...props }: TTourButton) => {
    if (!label) return null;
    return (
        <button className={type} {...props}>
            <Text color='prominent' align='center' weight='bold' as='span' line_height='s' size='xs'>
                {label}
            </Text>
        </button>
    );
};

export default TourButton;
