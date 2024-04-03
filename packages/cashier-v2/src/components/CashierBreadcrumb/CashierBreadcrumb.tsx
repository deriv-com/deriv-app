import React from 'react';
import { Breadcrumb } from '../Breadcrumb';

type TProps = {
    isCrypto: boolean;
    setIsDeposit: React.Dispatch<React.SetStateAction<boolean>>;
};

const CashierBreadcrumb: React.FC<TProps> = ({ isCrypto, setIsDeposit }) => {
    const depositCryptoCrumbs: React.ComponentProps<typeof Breadcrumb>['items'] = [
        { text: 'Cashier', value: 0 },
        { text: 'Deposit cryptocurrencies', value: 1 },
    ];

    const depositFiatCrumbs: React.ComponentProps<typeof Breadcrumb>['items'] = [
        { text: 'Cashier', value: 0 },
        { text: 'Deposit via bank wire, credit card, and e-wallet', value: 1 },
    ];

    const onBreadcrumbHandler: React.ComponentProps<typeof Breadcrumb>['onItemSelect'] = item => {
        if (item.value === 0) setIsDeposit(false);
    };

    return <Breadcrumb items={isCrypto ? depositCryptoCrumbs : depositFiatCrumbs} onItemSelect={onBreadcrumbHandler} />;
};

export default CashierBreadcrumb;
