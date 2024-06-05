import { Localize } from '@deriv/translations';
import React from 'react';
import { getContractDetailsConfig } from 'AppV2/Utils/contract-details-config';
import { observer } from '@deriv/stores';
import useContractDetails from 'AppV2/Hooks/useContractDetails';
import RiskManagementItem from '../RiskManagementItem';

const TakeProfit = observer(() => {
    const { contract_info } = useContractDetails();
    const { limit_order } = contract_info;
    const { is_take_profit_visible } = getContractDetailsConfig(contract_info.contract_type ?? '');
    return (
        is_take_profit_visible && (
            <RiskManagementItem
                label={<Localize i18n_default_text='Take profit' />}
                modal_body_content={
                    <Localize i18n_default_text='When your profit reaches or exceeds the set amount, your trade will be closed automatically.' />
                }
                value={limit_order?.take_profit?.order_amount}
                type='take_profit'
                validation_message='hello'
            />
        )
    );
});

export default TakeProfit;
