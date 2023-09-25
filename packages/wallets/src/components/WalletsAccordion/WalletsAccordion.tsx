import React, { ReactElement } from 'react';
import { useWalletAccountsList } from '@deriv/api';
import IcDropdown from '../../public/images/ic-dropdown.svg';
import './WalletsAccordion.scss';

type TProps = {
    wallet: NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[number];
    content: ReactElement;
    header: ReactElement;
};

const WalletsAccordion: React.FC<TProps> = ({ wallet, header, content }) => {
    const switchAccount = (loginid?: string) => {
        // if (!loginid) return;
        // implement switch account here
    };

    return (
        <div className={`wallets-accordion wallets-accordion${wallet?.is_virtual ? '--virtual' : ''}`}>
            <div
                className={`wallets-accordion__header wallets-accordion__header${
                    wallet?.is_virtual ? '--virtual' : ''
                }`}
            >
                {header}
                <div
                    className={`wallets-accordion__dropdown${wallet.is_active ? '--open' : ''}`}
                    onClick={() => switchAccount(wallet?.loginid)}
                >
                    <IcDropdown />
                </div>
            </div>
            <div className={`wallets-accordion__content${wallet.is_active ? '--visible' : ''}`}>
                {wallet.is_active && content}
            </div>
        </div>
    );
};

export default WalletsAccordion;
