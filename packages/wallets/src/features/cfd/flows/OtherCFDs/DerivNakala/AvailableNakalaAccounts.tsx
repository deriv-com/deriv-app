import React from 'react';
import {
    LabelPairedChevronLeftCaptionRegularIcon,
    LabelPairedChevronRightCaptionRegularIcon,
} from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { TradingAccountCard } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import useIsRtl from '../../../../../hooks/useIsRtl';
import { CFDDerivNakalaLinkAccount } from '../../../modals/DerivNakalaModal/DerivNakalaModal';

const AvailableNakalaTradeAccount: React.FC = () => {
    const isRtl = useIsRtl();
    const { hide, show } = useModal();

    const onPressNakala = () => {
        return show(<CFDDerivNakalaLinkAccount onclickAction={hide} />);
    };

    return (
        <TradingAccountCard onClick={() => onPressNakala()}>
            <TradingAccountCard.Icon data-testid='dt_icon_dxtrade'>test 2</TradingAccountCard.Icon>
            <TradingAccountCard.Section>
                <TradingAccountCard.Content>
                    <div className='wallets-available-mt5__title'>
                        <Text align='start' size='sm'>
                            Deriv Nakala
                        </Text>
                        <div className='wallets-available-mt5__badge'>
                            <Text align='start' size='xs' weight='bold'>
                                <Localize i18n_default_text='NEW' />
                            </Text>
                        </div>
                    </div>
                    <Text align='start' size='xs'>
                        <Localize i18n_default_text='Copy trading for CFDs on MT5.' />
                    </Text>
                </TradingAccountCard.Content>
                <TradingAccountCard.Button>
                    {isRtl ? (
                        <LabelPairedChevronLeftCaptionRegularIcon width={16} />
                    ) : (
                        <LabelPairedChevronRightCaptionRegularIcon width={16} />
                    )}
                </TradingAccountCard.Button>
            </TradingAccountCard.Section>
        </TradingAccountCard>
    );
};

export default AvailableNakalaTradeAccount;
