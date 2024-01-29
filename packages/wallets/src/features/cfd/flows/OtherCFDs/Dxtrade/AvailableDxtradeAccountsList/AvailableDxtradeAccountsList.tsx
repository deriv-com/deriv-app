import React from 'react';
import { useTranslation } from 'react-i18next';
import { TradingAccountCard } from '../../../../../../components';
import { WalletButton, WalletText } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import { getStaticUrl } from '../../../../../../helpers/urls';
import DerivX from '../../../../../../public/images/derivx.svg';
import { DxtradeEnterPasswordModal } from '../../../../modals';
import './AvailableDxtradeAccountsList.scss';

const AvailableDxtradeAccountsList: React.FC = () => {
    const { show } = useModal();
    const { t } = useTranslation();

    return (
        <TradingAccountCard
            leading={
                <div
                    className='wallets-available-dxtrade__icon'
                    onClick={() => {
                        window.open(getStaticUrl('/derivx'));
                    }}
                >
                    <DerivX />
                </div>
            }
            trailing={
                <WalletButton color='primary-light' onClick={() => show(<DxtradeEnterPasswordModal />)}>
                    {t('Get')}
                </WalletButton>
            }
        >
            <div className='wallets-available-dxtrade__details'>
                <p className='wallets-available-dxtrade__details-title'>
                    <WalletText size='sm' weight='bold'>
                        {t('Deriv X')}
                    </WalletText>
                </p>
                <WalletText size='xs'>
                    {t('This account offers CFDs on a highly customisable CFD trading platform.')}
                </WalletText>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableDxtradeAccountsList;
