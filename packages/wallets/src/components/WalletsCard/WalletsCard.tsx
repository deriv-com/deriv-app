import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useActiveWalletAccount } from '@deriv/api-v2';
import './WalletsCard.scss';

type TProps = {
    renderHeader: () => React.ReactNode;
};

const WalletsCard: React.FC<React.PropsWithChildren<TProps>> = ({ children, renderHeader }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const walletsCardRef = useRef<HTMLDivElement>(null);

    const isDemo = activeWallet?.is_virtual;
    const isOpen = activeWallet?.is_active;

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (isOpen && walletsCardRef?.current) {
                walletsCardRef.current.style.scrollMarginTop = '24px';
                walletsCardRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [isOpen]);

    return (
        <div
            className={classNames('wallets-cards', {
                'wallets-cards--virtual': isDemo,
            })}
            ref={walletsCardRef}
        >
            <div
                className={classNames('wallets-cards__header', {
                    'wallets-cards__header--virtual': isDemo,
                })}
            >
                {renderHeader()}
            </div>
            <div className='wallets-cards__content wallets-cards__content--visible'>{children}</div>
        </div>
    );
};

export default WalletsCard;
