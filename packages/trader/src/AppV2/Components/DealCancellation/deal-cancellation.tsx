import { Localize } from '@deriv/translations';
import React from 'react';
import { getContractDetailsConfig } from 'AppV2/Utils/contract-details-config';
import { observer } from '@deriv/stores';
import useContractDetails from 'AppV2/Hooks/useContractDetails';
import RiskManagementItem from '../RiskManagementItem';
import { isValidToCancel, isOpen } from '@deriv/shared';
import CardWrapper from '../CardWrapper';

const DealCancellation = observer(() => {
    const { contract_info } = useContractDetails();
    const { is_deal_cancellation_visible } = getContractDetailsConfig(contract_info.contract_type ?? '');

    const is_valid_to_cancel = isValidToCancel(contract_info);

    return is_valid_to_cancel && is_deal_cancellation_visible && isOpen(contract_info) ? (
        <CardWrapper>
            <RiskManagementItem
                label={<Localize i18n_default_text='Deal cancellation' />}
                modal_body_content={
                    <Localize i18n_default_text='When this is active, you can cancel your trade within the chosen time frame. Your stake will be returned without loss.' />
                }
                is_deal_cancellation
            />
        </CardWrapper>
    ) : null;
});

export default DealCancellation;
