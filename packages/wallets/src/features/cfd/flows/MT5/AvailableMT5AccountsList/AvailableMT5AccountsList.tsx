import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { TradingAccountCard, WalletButton, WalletText } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import { getStaticUrl } from '../../../../../helpers/urls';
import { THooks } from '../../../../../types';
import { MarketTypeDetails } from '../../../constants';
import { JurisdictionModal, MT5PasswordModal } from '../../../modals';
import './AvailableMT5AccountsList.scss';

type TProps = {
    account: THooks.SortedMT5Accounts;
};

const MT5AccountIcon: React.FC<TProps> = ({ account }) => {
    const IconToLink = () => {
        switch (account.market_type) {
            case 'financial':
            case 'synthetic':
            case 'all':
                return window.open(getStaticUrl('/dmt5'));
            default:
                return window.open(getStaticUrl('/dmt5'));
        }
    };
    return (
        <div className='wallets-available-mt5__icon' onClick={() => IconToLink()}>
            {MarketTypeDetails[account.market_type || 'all'].icon}
        </div>
    );
};

const AvailableMT5AccountsList: React.FC<TProps> = ({ account }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { setModalState, show } = useModal();
    const { description, title } = MarketTypeDetails[account.market_type || 'all'];
    const { t } = useTranslation();

    const onButtonClick = useCallback(() => {
        activeWallet?.is_virtual
            ? show(<MT5PasswordModal marketType={account?.market_type || 'synthetic'} platform={account.platform} />)
            : show(<JurisdictionModal />);
        setModalState('marketType', account.market_type);
    }, [activeWallet?.is_virtual, show, account.market_type, account.platform, setModalState]);

    return (
        <TradingAccountCard
            leading={<MT5AccountIcon account={account} />}
            trailing={
                <WalletButton color='primary-light' onClick={onButtonClick}>
                    {t(' Get')}
                </WalletButton>
            }
        >
            <div className='wallets-available-mt5__details'>
                <WalletText size='sm' weight='bold'>
                    {title}
                </WalletText>
                <WalletText size='xs'>{description}</WalletText>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableMT5AccountsList;
