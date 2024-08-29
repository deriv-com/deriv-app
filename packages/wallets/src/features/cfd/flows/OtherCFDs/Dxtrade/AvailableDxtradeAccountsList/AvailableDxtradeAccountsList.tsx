import React from 'react';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { TradingAccountCard } from '../../../../../../components';
import { WalletText } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import { PlatformDetails } from '../../../../constants';
import { DxtradeEnterPasswordModal } from '../../../../modals';
import './AvailableDxtradeAccountsList.scss';
import { Text } from '@deriv-com/ui';

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
                <div className='wallets-available-dxtrade__chevron'>
                    <LabelPairedChevronRightCaptionRegularIcon width={16} />
                </div>
            }
        >
            <div className='wallets-available-dxtrade__details'>
                <Text className='wallets-available-dxtrade__description' size='sm'>
                    Deriv X
                </Text>
                <Text className='wallets-available-dxtrade__description' size='xs'>
                    CFDs on financial and derived instruments via a customisable platform.
                </Text>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableDxtradeAccountsList;
