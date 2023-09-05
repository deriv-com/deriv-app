import React, { ReactElement, useMemo } from 'react';
import { useWalletAccountsList } from '@deriv/api';
import IcDropdown from '../../public/images/ic-dropdown.svg';
import './WalletsAccordion.scss';

type TProps = {
    account_info?: ReturnType<typeof useWalletAccountsList>['data'][number];
    active_account?: string;
    content: ReactElement;
    header: ReactElement;
    switchAccount: (loginid?: string) => void;
};

const WalletsAccordion: React.FC<TProps> = ({ active_account, account_info, switchAccount, header, content }) => {
    const is_open = useMemo(() => active_account === account_info?.loginid, [active_account]);

    return (
        <div className='wallets-accordion'>
            <button className='wallets-accordion__header' onClick={() => switchAccount(account_info?.loginid)}>
                {header}
                <div className={`wallets-accordion__dropdown${is_open ? '--open' : ''}`}>
                    <IcDropdown />
                </div>
            </button>
            <div className={`wallets-accordion__content${is_open ? '--visible' : ''}`}>{is_open && content}</div>
        </div>
    );
};

export default WalletsAccordion;
