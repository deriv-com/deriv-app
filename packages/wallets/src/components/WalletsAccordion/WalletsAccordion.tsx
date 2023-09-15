import React, { ReactElement, useEffect } from 'react';
import { useAuthorize, useWalletAccountsList } from '@deriv/api';
import IcDropdown from '../../public/images/ic-dropdown.svg';
import './WalletsAccordion.scss';

type TProps = {
    account: ReturnType<typeof useWalletAccountsList>['data'][number];
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
        <div className={`wallets-accordion wallets-accordion${is_virtual ? '--virtual' : ''}`}>
            <div className={`wallets-accordion__header wallets-accordion__header${is_virtual ? '--virtual' : ''}`}>
                {header}
                <div
                    className={`wallets-accordion__dropdown${is_active ? '--open' : ''}`}
                    onClick={() => switchAccount(loginid)}
                >
                    <IcDropdown />
                </div>
            </div>
            <div className={`wallets-accordion__content${is_active ? '--visible' : ''}`}>{is_active && content}</div>
        </div>
    );
};

export default WalletsAccordion;
