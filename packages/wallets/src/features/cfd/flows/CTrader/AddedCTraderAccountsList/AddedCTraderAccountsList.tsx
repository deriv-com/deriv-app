import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useCtraderAccountsList } from '@deriv/api-v2';
import { TradingAccountCard } from '../../../../../components';
import { WalletButton, WalletText } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { getStaticUrl } from '../../../../../helpers/urls';
import CTrader from '../../../../../public/images/ctrader.svg';
import { PlatformDetails } from '../../../constants';
import { MT5TradeModal } from '../../../modals';
import './AddedCTraderAccountsList.scss';

const AddedCTraderAccountsList: React.FC = () => {
    const history = useHistory();
    const { data: cTraderAccounts } = useCtraderAccountsList();
    const { show } = useModal();
    const { t } = useTranslation();

    return (
        <div className='wallets-added-ctrader'>
            {cTraderAccounts?.map(account => (
                <TradingAccountCard
                    key={`added-ctrader-${account.login}`}
                    leading={
                        <div
                            className='wallets-added-ctrader__icon'
                            onClick={() => {
                                window.open(getStaticUrl('/deriv-ctrader'));
                            }}
                            // Fix sonarcloud issue
                            onKeyDown={event => {
                                if (event.key === 'Enter') {
                                    window.open(getStaticUrl('/deriv-ctrader'));
                                }
                            }}
                        >
                            <CTrader />
                        </div>
                    }
                    trailing={
                        <div className='wallets-added-ctrader__actions'>
                            <WalletButton
                                onClick={() => {
                                    history.push(`/wallets/cashier/transfer`, { toAccountLoginId: account.account_id });
                                }}
                                variant='outlined'
                            >
                                Transfer
                            </WalletButton>
                            <WalletButton
                                onClick={() => show(<MT5TradeModal platform={PlatformDetails.ctrader.platform} />)}
                            >
                                {t('Open')}
                            </WalletButton>
                        </div>
                    }
                >
                    <div className='wallets-added-ctrader__details'>
                        <WalletText size='sm'>{PlatformDetails.ctrader.title}</WalletText>
                        <WalletText size='sm' weight='bold'>
                            {account?.formatted_balance}
                        </WalletText>
                        <WalletText color='primary' size='sm' weight='bold'>
                            {account.login}
                        </WalletText>
                    </div>
                </TradingAccountCard>
            ))}
        </div>
    );
};

export default AddedCTraderAccountsList;
