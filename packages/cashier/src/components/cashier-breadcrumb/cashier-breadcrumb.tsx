import React from 'react';
import { localize } from '@deriv/translations';
import { Breadcrumb } from '@deriv/ui';
import { useCashierStore } from '../../stores/useCashierStores';
import './cashier-breadcrumb.scss';

const CashierBreadcrumb = () => {
    const { general_store } = useCashierStore();
    const { is_crypto, is_deposit, setIsDeposit } = general_store;
    const is_deposit_crypto = is_deposit && is_crypto;

    const deposit_crypto_crumbs: React.ComponentProps<typeof Breadcrumb>['items'] = [
        { value: 0, text: localize('Cashier') },
        { value: 1, text: localize('Deposit cryptocurrencies') },
    ];

    const deposit_fiat_crumbs: React.ComponentProps<typeof Breadcrumb>['items'] = [
        { value: 0, text: localize('Cashier') },
        { value: 1, text: localize('Deposit via bank wire, credit card, and e-wallet') },
    ];

    const onBreadcrumbHandler: React.ComponentProps<typeof Breadcrumb>['handleOnClick'] = item => {
        switch (item.value) {
            case 0:
                setIsDeposit(false);
                break;
            default:
        }
    };

    // TODO: improve Breadcrumb component in deriv-ui project that it can accept custom classnames
    return (
        <div className='cashier-breadcrumb'>
            <Breadcrumb
                items={is_deposit_crypto ? deposit_crypto_crumbs : deposit_fiat_crumbs}
                handleOnClick={onBreadcrumbHandler}
            />
        </div>
    );
};

export default CashierBreadcrumb;
