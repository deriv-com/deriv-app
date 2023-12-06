import React from 'react';
import { Button } from '@deriv/components';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';

type TBuySellModalFooterProps = {
    is_submit_disabled: boolean;
    onCancel: () => void;
    onSubmit: null | void | (() => void);
};

const BuySellModalFooter = ({ is_submit_disabled, onCancel, onSubmit }: TBuySellModalFooterProps) => {
    const { my_profile_store } = useStores();

    return (
        <div
            className={
                my_profile_store.should_show_add_payment_method_form
                    ? 'add-payment-method__footer'
                    : 'buy-sell-modal-footer'
            }
        >
            <Button.Group>
                <Button secondary onClick={onCancel} large>
                    {localize('Cancel')}
                </Button>
                <Button is_disabled={is_submit_disabled} primary large onClick={onSubmit}>
                    {localize('Confirm')}
                </Button>
            </Button.Group>
        </div>
    );
};

export default BuySellModalFooter;
