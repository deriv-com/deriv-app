import React from 'react';
import { HintBox, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';

type TBuySellModalErrorProps = {
    error_message: string;
    show_low_balance_message: boolean;
};

const BuySellModalError = ({ error_message, show_low_balance_message }: TBuySellModalErrorProps) => {
    if (error_message || show_low_balance_message) {
        return (
            <div className='buy-sell-modal-error'>
                <HintBox
                    className='buy-sell-modal-error__danger'
                    icon='IcAlertDanger'
                    message={
                        <Text as='p' size='xxxs' color='prominent' line_height='s'>
                            {show_low_balance_message ? (
                                <Localize i18n_default_text="Your Deriv P2P balance isn't enough. Please increase your balance before trying again." />
                            ) : (
                                error_message
                            )}
                        </Text>
                    }
                    is_danger
                />
            </div>
        );
    }
    return null;
};

export default BuySellModalError;
