import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { WalletCashier } from '../../features';
import useDevice from '../../hooks/useDevice';
import './CashierModalRoute.scss';

const CashierModalRoute = () => {
    const { isMobile } = useDevice();
    const rootRef = useRef<HTMLElement>(document.getElementById('wallets_modal_root'));

    if (isMobile)
        return createPortal(
            <div className='wallets-cashier-modal-route'>
                <WalletCashier />
            </div>,
            // @ts-expect-error-next-line ref type mismatch
            rootRef.current
        );

    return (
        <div className='wallets-cashier-modal-route'>
            <WalletCashier />
        </div>
    );
};

export default CashierModalRoute;
