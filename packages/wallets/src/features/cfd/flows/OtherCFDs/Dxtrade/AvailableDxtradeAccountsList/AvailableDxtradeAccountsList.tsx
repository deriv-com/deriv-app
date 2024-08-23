import React from 'react';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { TradingAccountCard } from '../../../../../../components';
import { useModal } from '../../../../../../components/ModalProvider';
import { CFD_PLATFORMS, PlatformDetails } from '../../../../constants';
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
                    <Text size='sm'>Deriv X</Text>
                </p>
                <Text size='xs'>
                    <Localize
                        i18n_default_text='{{platform}} on financial and derived instruments via a customisable platform.'
                        values={{ platform: CFD_PLATFORMS.CFDS }}
                    />
                </Text>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableDxtradeAccountsList;
