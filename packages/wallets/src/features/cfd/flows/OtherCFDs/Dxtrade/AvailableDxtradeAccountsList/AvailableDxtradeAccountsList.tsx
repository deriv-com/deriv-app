import React from 'react';
import { useTranslation } from 'react-i18next';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { TradingAccountCard } from '../../../../../../components';
import { WalletText } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import { PlatformDetails } from '../../../../constants';
import { DxtradeEnterPasswordModal } from '../../../../modals';
import './AvailableDxtradeAccountsList.scss';

const AvailableDxtradeAccountsList: React.FC = () => {
    const { show } = useModal();
    const { t } = useTranslation();

    return (
        <TradingAccountCard onClick={() => show(<DxtradeEnterPasswordModal />)}>
            <TradingAccountCard.Icon className='wallets-available-dxtrade__icon' data-testid='dt_icon_dxtrade'>
                {PlatformDetails.dxtrade.icon}
            </TradingAccountCard.Icon>
            <TradingAccountCard.Content className='wallets-available-dxtrade__details'>
                <p className='wallets-available-dxtrade__details-title'>
                    <WalletText size='sm'>{t('Deriv X')}</WalletText>
                </p>
                <WalletText size='xs'>
                    {t('CFDs on financial and derived instruments via a customisable platform.')}
                </WalletText>
            </TradingAccountCard.Content>
            <TradingAccountCard.Button className='wallets-available-dxtrade__icon'>
                <LabelPairedChevronRightCaptionRegularIcon width={16} />
            </TradingAccountCard.Button>
        </TradingAccountCard>
    );
};

export default AvailableDxtradeAccountsList;
