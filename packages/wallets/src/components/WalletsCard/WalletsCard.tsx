import React, { useRef } from 'react';
import { THooks } from '../../types';
import './WalletsCard.scss';

type TProps = {
    isDemo?: THooks.WalletAccountsList['is_virtual'];
    renderHeader: () => React.ReactNode;
};

const WalletsCard: React.FC<React.PropsWithChildren<TProps>> = ({ children, isDemo = false, renderHeader }) => {
    const walletsCardRef = useRef<HTMLDivElement>(null);

    return (
        <div
            className={`wallets-card wallets-card ${isDemo ? 'wallets-card wallets-card--virtual' : ''}`}
            ref={walletsCardRef}
        >
            <div
                className={`wallets-card__header wallets-card__header ${
                    isDemo ? 'wallets-card__header wallets-card__header--virtual' : ''
                }`}
            >
                {renderHeader()}
            </div>
            <div className={`wallets-card__content wallets-card__content--visible`}>{children}</div>
        </div>
    );
};

export default WalletsCard;
