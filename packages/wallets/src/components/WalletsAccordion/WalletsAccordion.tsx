import React, { ReactElement, useEffect } from 'react';
import { useAuthorize, useWalletAccountsList } from '@deriv/api';
import IcDropdown from '../../public/images/ic-dropdown.svg';
import './WalletsAccordion.scss';

type TProps = {
    account: NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[number];
    content: ReactElement;
    header: ReactElement;
};

const WalletsAccordion: React.FC<TProps> = ({ account: { is_active, is_virtual, loginid }, content, header }) => {
    const { switchAccount } = useAuthorize();
    const accordionRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (is_active && accordionRef?.current) {
            accordionRef.current.style.scrollMarginTop = '24px';
            accordionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [is_active]);

    return (
        <div
            className={`wallets-accordion wallets-accordion ${
                is_virtual ? 'wallets-accordion wallets-accordion--virtual' : ''
            }`}
        >
            <div
                className={`wallets-accordion__header wallets-accordion__header ${
                    is_virtual ? 'wallets-accordion__header wallets-accordion__header--virtual' : ''
                }`}
            >
                {header}
                <div
                    className={`wallets-accordion__dropdown ${is_active ? 'wallets-accordion__dropdown--open' : ''}`}
                    // onClick={() => switchAccount(loginid)}
                >
                    <IcDropdown />
                </div>
            </div>
            <div className={`wallets-accordion__content ${is_active ? 'wallets-accordion__content--visible' : ''}`}>
                {is_active && content}
            </div>
        </div>
    );
};

export default WalletsAccordion;
