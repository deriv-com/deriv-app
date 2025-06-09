import React from 'react';
import { TAddedMT5Account } from 'src/types';
import {
    LabelPairedChevronLeftCaptionRegularIcon,
    LabelPairedChevronRightCaptionRegularIcon,
} from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { TradingAccountCard } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import useIsRtl from '../../../../../hooks/useIsRtl';
import DerivNakalaIcon from '../../../../../public/images/ic-brand-deriv-nakala.svg';
import { PlatformStatusBadge } from '../../../components';
import { DISABLED_PLATFORM_STATUSES } from '../../../constants';
import { TradingPlatformStatusModal } from '../../../modals';
import { CFDDerivNakalaLinkAccount } from '../../../modals/DerivNakalaModal/DerivNakalaModal';
import { useAddedMT5Account } from '../../MT5/AddedMT5AccountsList/hooks';

type TDisabledPlatformStatus = (typeof DISABLED_PLATFORM_STATUSES)[number];

const AvailableNakalaTradeAccount = (account: TAddedMT5Account) => {
    const isRtl = useIsRtl();

    const { hide, show } = useModal();
    const { hasDisabledPlatformStatus, isAccountDisabled, platformStatus } = useAddedMT5Account(account);

    const onPressNakala = () => {
        if (hasDisabledPlatformStatus) {
            return show(<TradingPlatformStatusModal status={platformStatus as TDisabledPlatformStatus} />, {
                defaultRootId: 'wallets_modal_root',
            });
        }
        return show(<CFDDerivNakalaLinkAccount onclickAction={hide} />);
    };

    return (
        <React.Fragment>
            <TradingAccountCard onClick={() => onPressNakala()}>
                <TradingAccountCard.Icon data-testid='dt_icon_dxtrade'>
                    <DerivNakalaIcon height={48} width={48} />
                </TradingAccountCard.Icon>
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
                            <Localize i18n_default_text='Copy trading for CFDs on MT5' />
                        </Text>

                        {!isAccountDisabled && platformStatus && (
                            <PlatformStatusBadge badgeSize='md' status={platformStatus as TDisabledPlatformStatus} />
                        )}
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
        </React.Fragment>
    );
};

export default AvailableNakalaTradeAccount;
