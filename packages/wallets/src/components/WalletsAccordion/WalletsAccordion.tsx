import React, { useEffect, useRef } from 'react';
import IcDropdown from '../../public/images/ic-dropdown.svg';
import { THooks } from '../../types';
import './WalletsAccordion.scss';

type TProps = {
    isDemo?: THooks.WalletAccountsList['is_virtual'];
    isOpen?: THooks.WalletAccountsList['is_active'];
    onToggle?: () => void;
    renderHeader: () => React.ReactNode;
};

const WalletsAccordion: React.FC<React.PropsWithChildren<TProps>> = ({
    children,
    isDemo = false,
    isOpen = false,
    onToggle,
    renderHeader,
}) => {
    const accordionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (isOpen && accordionRef?.current) {
                accordionRef.current.style.scrollMarginTop = '24px';
                accordionRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [isOpen]);

    return (
        <div
            className={`wallets-accordion wallets-accordion ${
                isDemo ? 'wallets-accordion wallets-accordion--virtual' : ''
            }`}
            ref={accordionRef}
        >
            <div
                className={`wallets-accordion__header wallets-accordion__header ${
                    isDemo ? 'wallets-accordion__header wallets-accordion__header--virtual' : ''
                }`}
            >
                {renderHeader()}
                {!isOpen && (
                    <div
                        className={`wallets-accordion__dropdown ${isOpen ? 'wallets-accordion__dropdown--open' : ''}`}
                        onClick={onToggle}
                    >
                        <IcDropdown />
                    </div>
                )}
            </div>
            <div className={`wallets-accordion__content ${isOpen ? 'wallets-accordion__content--visible' : ''}`}>
                {isOpen && children}
            </div>
        </div>
    );
};

export default WalletsAccordion;
