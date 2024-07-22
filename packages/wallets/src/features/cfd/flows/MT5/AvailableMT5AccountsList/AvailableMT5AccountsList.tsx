import React, { useCallback } from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { TradingAccountCard, WalletText } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import { THooks } from '../../../../../types';
import { MarketTypeDetails } from '../../../constants';
import { JurisdictionModal, MT5PasswordModal } from '../../../modals';
import './AvailableMT5AccountsList.scss';

type TProps = {
    account: THooks.SortedMT5Accounts;
};

const AvailableMT5AccountsList: React.FC<TProps> = ({ account }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { setModalState, show } = useModal();
    const { description, title } = MarketTypeDetails[account.market_type || 'all'];

    const onButtonClick = useCallback(() => {
        activeWallet?.is_virtual
            ? show(<MT5PasswordModal marketType={account?.market_type || 'synthetic'} platform={account.platform} />)
            : show(<JurisdictionModal />);
        setModalState('marketType', account.market_type);
    }, [activeWallet?.is_virtual, show, account.market_type, account.platform, setModalState]);

    return (
        <TradingAccountCard onClick={onButtonClick}>
            <TradingAccountCard.Icon>{MarketTypeDetails[account.market_type || 'all'].icon}</TradingAccountCard.Icon>
            <TradingAccountCard.Content className='wallets-available-mt5__details'>
                <WalletText size='sm'>{title}</WalletText>
                <WalletText size='xs'>{description}</WalletText>
            </TradingAccountCard.Content>
            <TradingAccountCard.Button>
                <LabelPairedChevronRightCaptionRegularIcon width={16} />
            </TradingAccountCard.Button>
        </TradingAccountCard>
    );
};

export default AvailableMT5AccountsList;
