import React from 'react';
import { Dialog } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import { useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';
import './need-real-account-for-cashier-modal.scss';

const NeedRealAccountForCashierModal = observer(() => {
    const { ui, traders_hub } = useStore();
    const { is_eu_user, selectRegion } = traders_hub;
    const {
        is_need_real_account_for_cashier_modal_visible: is_open,
        toggleNeedRealAccountForCashierModal,
        disableApp,
        enableApp,
        openRealAccountSignup,
    } = ui;

    const history = useHistory();

    const createAccount = () => {
        toggleNeedRealAccountForCashierModal();
        return is_eu_user ? openRealAccountSignup('maltainvest') : openRealAccountSignup();
    };

    const switchRegulation = () => {
        return is_eu_user ? selectRegion('Non-EU') : selectRegion('EU');
    };

    const onClose = async () => {
        toggleNeedRealAccountForCashierModal();
        await switchRegulation();
        history.push(routes.cashier_deposit);
    };

    const regulation = is_eu_user ? 'EU' : 'non-EU';

    const active_real_regulation = is_eu_user ? 'non-EU' : 'EU';

    return (
        <Dialog
            className='need-real-account-for-cashier-dialog'
            title={localize('The cashier is for real accounts only')}
            confirm_button_text={localize('Add account')}
            onConfirm={createAccount}
            cancel_button_text={localize('Switch account')}
            onCancel={onClose}
            is_closed_on_cancel
            disableApp={disableApp}
            enableApp={enableApp}
            is_closed_on_confirm
            is_visible={is_open}
            dismissable={false}
            has_close_icon
            onClose={toggleNeedRealAccountForCashierModal}
        >
            <Localize
                i18n_default_text='It looks like you don’t have a real {{regulation}} account. To use the cashier, switch to your {{active_real_regulation}} real account, or get an {{regulation}} real account.'
                values={{ regulation, active_real_regulation }}
            />
        </Dialog>
    );
});

export default NeedRealAccountForCashierModal;
