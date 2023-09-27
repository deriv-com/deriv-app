import React from 'react';
import { Popover, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';

type TQSInputLabel = {
    children?: React.ReactNode;
    label?: string;
    description?: string;
};

const QSInputLabel: React.FC<TQSInputLabel> = ({ label, description }) => {
    const is_mobile = isMobile();

    return (
        <div className='qs__input-label'>
            <Text weight='bold' className='qs__input-label__wrapper' size='xs'>
                {label}
            </Text>
            <span>
                <Popover message={description} zIndex='9999' alignment={is_mobile ? 'bottom' : 'right'} icon='info' />
            </span>
        </div>
    );
};

export default QSInputLabel;
