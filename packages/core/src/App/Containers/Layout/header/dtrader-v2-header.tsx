import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { getCurrencyDisplayCode } from '@deriv/shared';
import AccountInfoIcon from 'App/Components/Layout/Header/account-info-icon';

const DTraderV2Header = observer(() => {
    const { client } = useStore();
    const { balance, currency, is_virtual, loginid } = client;

    const currency_lower = currency?.toLowerCase();

    return (
        <header className='header headerV2'>
            <React.Suspense fallback={<div />}>
                <div className='headerV2__acc-info'>
                    <div className='headerV2__acc-info--top'>
                        <span className='headerV2__acc-info--logo'>
                            {(is_virtual || currency) && (
                                <AccountInfoIcon is_virtual={is_virtual} currency={currency_lower} />
                            )}
                        </span>

                        {loginid}
                    </div>
                    <div className='headerV2__acc-info--bottom'>
                        <span>{`${balance} ${getCurrencyDisplayCode(currency)}`}</span>
                    </div>
                </div>
            </React.Suspense>
        </header>
    );
});

export default DTraderV2Header;
