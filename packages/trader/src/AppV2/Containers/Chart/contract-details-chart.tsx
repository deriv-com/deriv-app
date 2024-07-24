import { isAccumulatorContract, isResetContract } from '@deriv/shared';
import useContractDetails from 'AppV2/Hooks/useContractDetails';
import { observer } from 'mobx-react';
import ReplayChart from 'Modules/Contract/Containers/replay-chart';
import React from 'react';

const ContractDetailsChart = observer(() => {
    const { contract_info } = useContractDetails();
    const is_reset_contract = isResetContract(contract_info.contract_type);
    const is_accumulator = isAccumulatorContract(contract_info.contract_type);

    return (
        <div className='contract-details-chart'>
            <ReplayChart is_accumulator_contract={is_accumulator} is_reset_contract={is_reset_contract} />
        </div>
    );
});

export default ContractDetailsChart;
