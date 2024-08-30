import React from 'react';
import {
    LabelPairedChevronLeftCaptionRegularIcon,
    LabelPairedChevronRightCaptionRegularIcon,
} from '@deriv/quill-icons';
import { TradingAccountCard } from '../../../../../../components';
import { WalletText } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import useIsRtl from '../../../../../../hooks/useIsRtl';
import { PlatformDetails } from '../../../../constants';
import { DxtradeEnterPasswordModal } from '../../../../modals';

const AvailableDxtradeAccountsList: React.FC = () => {
    const { show } = useModal();
    const isRtl = useIsRtl();

    return (
        <TradingAccountCard onClick={() => show(<DxtradeEnterPasswordModal />)}>
            <TradingAccountCard.Icon data-testid='dt_icon_dxtrade'>
                {PlatformDetails.dxtrade.icon}
            </TradingAccountCard.Icon>
            <TradingAccountCard.Content>
                <p className='wallets-available-dxtrade__details-title'>
                    <WalletText size='sm'>Deriv X</WalletText>
                </p>
                <WalletText size='xs'>
                    CFDs on financial and derived instruments via a customisable platform.
                </WalletText>
            </TradingAccountCard.Content>
            <TradingAccountCard.Button>
                {isRtl ? (
                    <LabelPairedChevronLeftCaptionRegularIcon width={16} />
                ) : (
                    <LabelPairedChevronRightCaptionRegularIcon width={16} />
                )}
            </TradingAccountCard.Button>
        </TradingAccountCard>
    );
};

export default AvailableDxtradeAccountsList;
