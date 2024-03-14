import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useDxtradeAccountsList } from '@deriv/api-v2';
import { TradingAccountCard } from '../../../../../../components';
import { WalletButton, WalletText } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import { getStaticUrl } from '../../../../../../helpers/urls';
import DerivX from '../../../../../../public/images/derivx.svg';
import { PlatformDetails } from '../../../../constants';
import { MT5TradeModal } from '../../../../modals';
import './AddedDxtradeAccountsList.scss';

const AddedDxtradeAccountsList: React.FC = () => {
    const history = useHistory();
    const { data } = useDxtradeAccountsList();
    const { show } = useModal();
    const { t } = useTranslation();

    const leadingComponent = (
        <div
            className='wallets-available-derivx__icon'
            onClick={() => {
                window.open(getStaticUrl('/derivx'));
            }}
            // Fix sonarcloud issue
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    window.open(getStaticUrl('/derivx'));
                }
            }}
        >
            <DerivX />
        </div>
    );

    const trailingComponent = (loginid?: string) => (
        <div className='wallets-available-derivx__actions'>
            <WalletButton
                onClick={() => {
                    history.push(`/wallets/cashier/transfer`, { toAccountLoginId: loginid });
                }}
                variant='outlined'
            >
                {t('Transfer')}
            </WalletButton>
            <WalletButton onClick={() => show(<MT5TradeModal platform={PlatformDetails.dxtrade.platform} />)}>
                {t('Open')}
            </WalletButton>
        </div>
    );

    return (
        <React.Fragment>
            {data?.map(account => (
                <TradingAccountCard
                    key={account?.account_id}
                    leading={leadingComponent}
                    trailing={trailingComponent(account.account_id)}
                >
                    <div className='wallets-available-derivx__details'>
                        <WalletText size='sm'>{PlatformDetails.dxtrade.title}</WalletText>
                        <WalletText size='sm' weight='bold'>
                            {account?.display_balance}
                        </WalletText>
                        <WalletText color='primary' size='xs' weight='bold'>
                            {account?.login}
                        </WalletText>
                    </div>
                </TradingAccountCard>
            ))}
        </React.Fragment>
    );
};

export default AddedDxtradeAccountsList;
