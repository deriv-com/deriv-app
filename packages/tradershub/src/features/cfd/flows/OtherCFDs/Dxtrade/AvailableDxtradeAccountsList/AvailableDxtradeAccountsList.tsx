import React from 'react';
import { useRegulationFlags } from '@/hooks';
import { Provider } from '@deriv/library';
import {
    GetADerivAccountDialog,
    PlatformIcon,
    TradingAccountCard,
    TradingAccountCardContent,
    TradingAccountCardLightButton,
} from '../../../../../../components';
import { getStaticUrl } from '../../../../../../helpers/urls';
import { PlatformDetails } from '../../../../constants';
import { DxtradePasswordModal } from '../../../../modals/DxtradePasswordModal';

const LeadingIcon = () => (
    <div>
        <PlatformIcon
            icon='DerivX'
            onClick={() => {
                window.open(getStaticUrl('/derivx'));
            }}
        />
    </div>
);

const AvailableDxtradeAccountsList = () => {
    const { hasActiveDerivAccount } = useRegulationFlags();
    const { show } = Provider.useModal();
    const { setCfdState } = Provider.useCFDContext();

    const TrailingButton = () => <TradingAccountCardLightButton onSubmit={trailingButtonClick} />;

    const trailingButtonClick = () => {
        setCfdState('platform', PlatformDetails.dxtrade.platform);
        if (!hasActiveDerivAccount) {
            show(<GetADerivAccountDialog />);
        } else {
            show(<DxtradePasswordModal />);
        }
    };
    return (
        <TradingAccountCard leading={LeadingIcon} trailing={TrailingButton}>
            <TradingAccountCardContent title={PlatformDetails.dxtrade.title}>
                This account offers CFDs on a highly customisable CFD trading platform.
            </TradingAccountCardContent>
        </TradingAccountCard>
    );
};

export default AvailableDxtradeAccountsList;
