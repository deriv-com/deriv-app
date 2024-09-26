import React from 'react';
import { Analytics } from '@deriv-com/analytics';
import { useDevice } from '@deriv-com/ui';
import { Dialog, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import './deposit-now-or-later-modal.scss';

const DepositNowOrLaterModal = observer(() => {
    const { isMobile } = useDevice();
    const { ui } = useStore();
    const {
        should_show_deposit_now_or_later_modal,
        setShouldShowDepositNowOrLaterModal,
        setShouldShowOneTimeDepositModal,
    } = ui;

    const onConfirmModal = () => {
        Analytics.trackEvent('ce_tradershub_popup', {
            // @ts-expect-error 'click_download' property is changed to 'click_cta'
            action: 'click_cta',
            form_name: 'traders_hub_default',
            account_mode: 'real',
            popup_name: 'deposit_now_or_later',
            popup_type: 'with_cta',
            // 'cta_name' property type will be added later
            cta_name: 'deposit_now',
        });

        setShouldShowDepositNowOrLaterModal(false);
    };

    const onClose = (is_click_on_cancel_button = false) => {
        if (is_click_on_cancel_button)
            Analytics.trackEvent('ce_tradershub_popup', {
                // @ts-expect-error 'click_download' property is changed to 'click_cta'
                action: 'click_cta',
                form_name: 'traders_hub_default',
                account_mode: 'real',
                popup_name: 'deposit_now_or_later',
                popup_type: 'with_cta',
                // 'cta_name' property type will be added later
                cta_name: 'deposit_later',
            });
        else
            Analytics.trackEvent('ce_tradershub_popup', {
                action: 'close',
                form_name: 'traders_hub_default',
                account_mode: 'real',
                popup_name: 'deposit_now_or_later',
                popup_type: 'with_cta',
            });

        setShouldShowDepositNowOrLaterModal(false);

        if (is_click_on_cancel_button) {
            setShouldShowOneTimeDepositModal(false);
        }
    };

    React.useEffect(() => {
        if (should_show_deposit_now_or_later_modal) {
            Analytics.trackEvent('ce_tradershub_popup', {
                action: 'open',
                form_name: 'traders_hub_default',
                account_mode: 'real',
                popup_name: 'deposit_now_or_later',
                popup_type: 'with_cta',
            });
        }
    }, [should_show_deposit_now_or_later_modal]);

    return (
        <Dialog
            className='deposit-now-or-later-modal'
            title={<Localize i18n_default_text='Add funds and start trading' />}
            confirm_button_text={localize('Deposit now')}
            onConfirm={onConfirmModal}
            cancel_button_text={localize('Deposit later')}
            onCancel={() => onClose(true)}
            onClose={onClose}
            is_visible={should_show_deposit_now_or_later_modal}
            has_close_icon
            is_closed_on_cancel={false}
        >
            <Text align='center' size={isMobile ? 'xxs' : 'xs'}>
                <Localize i18n_default_text="Make a deposit to trade the world's markets!" />
            </Text>
        </Dialog>
    );
});

export default DepositNowOrLaterModal;
