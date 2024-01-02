import React from 'react';
import { Analytics } from '@deriv/analytics';
import { Popover, Text } from '@deriv/components';
import { observer } from '@deriv/stores';

type TQSInputLabel = {
    children?: React.ReactNode;
    label?: string;
    description?: string;
};

const QSInputLabel: React.FC<TQSInputLabel> = observer(({ label, description }) => {
    const sendEventToRudderstack = () => {
        Analytics.trackEvent('ce_bot_quick_strategy_form', {
            action: 'info_popup_open',
            form_source: 'ce_bot_quick_strategy_form',
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
