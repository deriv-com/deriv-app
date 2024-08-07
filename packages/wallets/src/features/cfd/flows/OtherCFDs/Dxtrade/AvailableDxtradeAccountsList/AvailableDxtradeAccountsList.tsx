import React from 'react';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { TradingAccountCard } from '../../../../../../components';
import { WalletText } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import { PlatformDetails } from '../../../../constants';
import { DxtradeEnterPasswordModal } from '../../../../modals';
import './AvailableDxtradeAccountsList.scss';

const AvailableDxtradeAccountsList: React.FC = () => {
    const { show } = useModal();

    return (
        <TradingAccountCard
            leading={
                <div className='wallets-available-dxtrade__icon' data-testid='dt_icon_dxtrade'>
                    {PlatformDetails.dxtrade.icon}
                </div>
            }
            onClick={() => show(<DxtradeEnterPasswordModal />)}
            trailing={
                <div className='wallets-available-dxtrade__icon'>
                    <LabelPairedChevronRightCaptionRegularIcon width={16} />
                </div>
            }
        >
            <div className='wallets-available-dxtrade__details'>
                <p className='wallets-available-dxtrade__details-title'>
                    <WalletText size='sm'>Deriv X</WalletText>
                </p>
                <WalletText size='xs'>
                    CFDs on financial and derived instruments via a customisable platform.
                </WalletText>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableDxtradeAccountsList;
