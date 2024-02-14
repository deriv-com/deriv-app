import React from 'react';
import { Popover, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { rudderStackSendQsInfoPopupEvent } from '../analytics/rudderstack-quick-strategy';

type TQSInputLabel = {
    children?: React.ReactNode;
    label?: string;
    description?: string;
};

const QSInputLabel: React.FC<TQSInputLabel> = observer(({ label, description }) => {
    const sendEventToRudderstack = () => {
        rudderStackSendQsInfoPopupEvent({
            parameter_type: label,
        });
    };

    return (
        <div className='qs__form__field'>
            <div className='qs__input-label'>
                <Text weight='bold' className='qs__input-label__wrapper' size='xs'>
                    {label}
                </Text>
                <span>
                    <Popover
                        onClick={sendEventToRudderstack}
                        message={description}
                        zIndex='9999'
                        alignment='top'
                        icon='info'
                    />
                </span>
            </div>
        </div>
    );
});

export default QSInputLabel;
