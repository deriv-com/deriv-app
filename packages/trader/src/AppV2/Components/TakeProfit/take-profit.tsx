import { Localize } from '@deriv/translations';
import React from 'react';
import { getContractDetailsConfig } from 'AppV2/Utils/contract-details-config';
import { observer } from '@deriv/stores';
import useContractDetails from 'AppV2/Hooks/useContractDetails';
import RiskManagementItem from '../RiskManagementItem';

type TakeProfitProps = {
    validation_params?: {
        [key: string]: { min: number; max: number };
    };
};

const TakeProfit = observer(({ validation_params }: TakeProfitProps) => {
    const { contract_info } = useContractDetails();
    const { limit_order } = contract_info;
    const { isTakeProfitVisible } = getContractDetailsConfig(contract_info.contract_type ?? '');
    return isTakeProfitVisible ? (
        <RiskManagementItem
            label={<Localize i18n_default_text='Take profit' />}
            modal_body_content={
                <Localize i18n_default_text='When your profit reaches or exceeds the set amount, your trade will be closed automatically.' />
            }
            value={limit_order?.take_profit?.order_amount}
            validation_params={validation_params}
            type='take_profit'
        />
    ) : null;
});

export default TakeProfit;
