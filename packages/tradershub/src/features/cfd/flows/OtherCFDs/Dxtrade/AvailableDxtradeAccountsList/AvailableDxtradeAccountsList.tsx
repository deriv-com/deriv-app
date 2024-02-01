import React from 'react';
import { Provider } from '@deriv/library';
import {
    TradingAccountCard,
    TradingAccountCardContent,
    TradingAccountCardLightButton,
} from '../../../../../../components/TradingAccountCard';
import { getStaticUrl } from '../../../../../../helpers/urls';
import DerivX from '../../../../../../public/images/cfd/derivx.svg';
import { PlatformDetails } from '../../../../constants';
import { DxtradePasswordModal } from '../../../../modals/DxtradePasswordModal';

const LeadingIcon = () => (
    <div
        className='cursor-pointer'
        onClick={() => {
            window.open(getStaticUrl('/derivx'));
        }}
        onKeyDown={e => {
            if (e.key === 'Enter') {
                window.open(getStaticUrl('/derivx'));
            }
        }}
        role='button'
    >
        <DerivX />
    </div>
);

const AvailableDxtradeAccountsList = () => {
    const { show } = Provider.useModal();

    const TrailingButton = () => <TradingAccountCardLightButton onSubmit={trailingButtonClick} />;

    const trailingButtonClick = () => {
        show(<DxtradePasswordModal />);
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
