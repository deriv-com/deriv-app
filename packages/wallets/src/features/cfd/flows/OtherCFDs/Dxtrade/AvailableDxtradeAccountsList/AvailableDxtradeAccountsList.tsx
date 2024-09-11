import React from 'react';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { TradingAccountCard } from '../../../../../../components';
import { WalletText } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import { PlatformDetails } from '../../../../constants';
import { DxtradeEnterPasswordModal } from '../../../../modals';

const AvailableDxtradeAccountsList: React.FC = () => {
    const { show } = useModal();

    return (
        <TradingAccountCard onClick={() => show(<DxtradeEnterPasswordModal />)}>
            <TradingAccountCard.Icon data-testid='dt_icon_dxtrade'>
                {PlatformDetails.dxtrade.icon}
            </TradingAccountCard.Icon>
            <TradingAccountCard.Section>
                <TradingAccountCard.Content>
                    <p className='wallets-available-dxtrade__details-title'>
                        <WalletText size='sm'>Deriv X</WalletText>
                    </p>
                    <WalletText size='xs'>
                        <Localize i18n_default_text='CFDs on financial and derived instruments via a customisable platform.' />
                    </WalletText>
                </TradingAccountCard.Content>
                <TradingAccountCard.Button>
                    <LabelPairedChevronRightCaptionRegularIcon width={16} />
                </TradingAccountCard.Button>
            </TradingAccountCard.Section>
        </TradingAccountCard>
    );
};

export default AvailableDxtradeAccountsList;
