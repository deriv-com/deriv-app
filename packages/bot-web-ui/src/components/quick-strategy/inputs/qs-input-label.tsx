import React from 'react';
import classNames from 'classnames';
import { Popover, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Analytics } from '@deriv/analytics';

type TQSInputLabel = {
    children?: React.ReactNode;
    label?: string;
    description?: string;
    fullwidth?: boolean;
};

const QSInputLabel: React.FC<TQSInputLabel> = observer(({ label, description, fullwidth = false }) => {
    const sendEventToRudderstack = () => {
        Analytics.trackEvent('ce_bot_quick_strategy_form', {
            action: 'info_popup_open',
            form_source: 'ce_bot_quick_strategy_form',
        });
    };

    return (
        <div className={classNames('qs__form__field', { 'full-width': fullwidth })}>
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
