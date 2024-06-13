import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { getCurrencyDisplayCode } from '@deriv/shared';
import AccountInfoIcon from 'App/Components/Layout/Header/account-info-icon';
import { CaptionText } from '@deriv-com/quill-ui';
import HeaderAccountActionsDTraderV2 from './header-account-actions-dtrader-v2';

const DTraderV2Header = observer(() => {
    // TODO: clean
    const { client } = useStore();
    const { balance, currency, is_virtual, loginid } = client;

    const currency_lower = currency?.toLowerCase();

    return (
        <header className='header header-v2'>
            <React.Suspense fallback={<div />}>
                <HeaderAccountActionsDTraderV2 />
            </React.Suspense>
        </header>
    );
});

export default DTraderV2Header;
