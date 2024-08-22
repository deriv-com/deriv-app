import React from 'react';
import { InlineMessage } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { localize } from 'Components/i18next';
import { getInlineTextSize } from 'Utils/responsive';

type TBuySellModalErrorProps = {
    error_message: string;
    show_low_balance_message: boolean;
};

const BuySellModalError = ({ error_message, show_low_balance_message }: TBuySellModalErrorProps) => {
    const { isMobile } = useDevice();
    if (error_message || show_low_balance_message) {
        return (
            <div className='buy-sell-modal-error'>
                <InlineMessage
                    message={
                        show_low_balance_message
                            ? localize(
                                  "Your Deriv P2P balance isn't enough. Please increase your balance before trying again."
                              )
                            : error_message
                    }
                    size={getInlineTextSize('sm', 'xs', isMobile)}
                    type='error'
                />
            </div>
        );
    }
    return null;
};

export default BuySellModalError;
