import React from 'react';
import { Popover, Text } from '@deriv/components';

type TQSInputLabel = {
    children?: React.ReactNode;
    label?: string;
    description?: string | ((additional_data?: Record<string, any>) => React.ReactNode);
    additional_data?: Record<string, any>;
};

const QSInputLabel: React.FC<TQSInputLabel> = ({ label, description, additional_data }) => {
    let tooltip_msg;
    if (typeof description === 'function') {
        tooltip_msg = description(additional_data);
    } else {
        tooltip_msg = description;
    }

    return (
        <div className='qs__form__field'>
            <div className='qs__input-label'>
                <Text weight='bold' className='qs__input-label__wrapper' size='xs'>
                    {label}
                </Text>
                <span>
                    <Popover message={tooltip_msg} zIndex='9999' alignment='top' icon='info' />
                </span>
            </div>
        </div>
    );
};

export default QSInputLabel;
