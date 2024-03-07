import React, { Fragment, useState } from 'react';
import { getCfdsAccountTitle } from '@/helpers/cfdsAccountHelpers';
import { useRegulationFlags } from '@/hooks';
import { useCFDContext, useModal } from '@/providers';
import { useActiveTradingAccount } from '@deriv/api-v2';
import { URLUtils } from '@deriv-com/utils';
import {
    GetADerivAccountDialog,
    IconComponent,
    TradingAccountCard,
    TradingAccountCardContent,
    TradingAccountCardLightButton,
} from '../../../../../../components';
import { PlatformDetails } from '../../../../constants';
import { DxtradePasswordModal } from '../../../../modals/DxtradePasswordModal';

const { getDerivStaticURL } = URLUtils;

const LeadingIcon = () => (
    <div>
        <IconComponent
            icon='DerivX'
            onClick={() => {
                window.open(getDerivStaticURL('/derivx'));
            }}
        />
    </div>
);

const AvailableDxtradeAccountsList = () => {
    const { hasActiveDerivAccount } = useRegulationFlags();
    const { show } = useModal();
    const { setCfdState } = useCFDContext();
    const { data: activeTradingAccount } = useActiveTradingAccount();

    const [isDerivedAccountModalOpen, setIsDerivedAccountModalOpen] = useState(false);

    const TrailingButton = () => <TradingAccountCardLightButton onSubmit={trailingButtonClick} />;

    const title = getCfdsAccountTitle(PlatformDetails.dxtrade.title, activeTradingAccount?.is_virtual);

    const trailingButtonClick = () => {
        setCfdState({ platform: PlatformDetails.dxtrade.platform });
        if (!hasActiveDerivAccount) {
            setIsDerivedAccountModalOpen(true);
        } else {
            show(<DxtradePasswordModal />);
        }
    };
    return (
        <Fragment>
            <TradingAccountCard leading={LeadingIcon} trailing={TrailingButton}>
                <TradingAccountCardContent title={title}>
                    This account offers CFDs on a highly customisable CFD trading platform.
                </TradingAccountCardContent>
            </TradingAccountCard>
            <GetADerivAccountDialog
                isOpen={isDerivedAccountModalOpen}
                onClose={() => setIsDerivedAccountModalOpen(false)}
            />
        </Fragment>
    );
};

export default AvailableDxtradeAccountsList;
