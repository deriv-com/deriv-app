import React, { useCallback, useState } from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { WalletLoader } from '../../components';
import { WalletCashierContent, WalletCashierHeader } from './components';
import { CashierScrollContext } from './context';
import './WalletCashier.scss';
import { useHistory } from 'react-router-dom';

const WalletCashier = () => {
    const { isLoading } = useActiveWalletAccount();
    const { location } = useHistory();

    // Using type assertion to handle the property that might not be in all route states
    const is_location_from_traders = location?.state
        ? (location.state as Record<string, unknown>).is_from_traders
        : undefined;

    const [onCashierScroll, setOnCashierScroll] = useState<React.UIEventHandler<HTMLDivElement> | null>(null);

    const [isContentScrolled, setIsContentScrolled] = useState(false);

    const onContentScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
            const target = e.currentTarget as HTMLDivElement;
            setIsContentScrolled(target.scrollTop > 0);
            onCashierScroll?.(e);
        },
        [onCashierScroll]
    );

    if (isLoading) return <WalletLoader />;

    return (
        <div className='wallets-cashier'>
            <WalletCashierHeader hideWalletDetails={isContentScrolled} is_dtrader={Boolean(is_location_from_traders)} />
            <CashierScrollContext.Provider value={{ onCashierScroll, setOnCashierScroll }}>
                <div
                    className='wallets-cashier-content'
                    data-testid='dt_wallets_cashier_content'
                    onScroll={onContentScroll}
                >
                    <WalletCashierContent />
                </div>
            </CashierScrollContext.Provider>
        </div>
    );
};

export default WalletCashier;
