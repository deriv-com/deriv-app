import React from 'react';
import IconTradeTypes from '../../icon-trade-types';

type ContractTypeCellProps = {
    getContractTypeDisplay: () => void;
    is_high_low: boolean;
    type: string;
};

const ContractTypeCell = ({ getContractTypeDisplay, is_high_low, multiplier, type }: ContractTypeCellProps) => (
    <div className='dc-contract-type'>
        <div className='dc-contract-type__type-wrapper'>
            <IconTradeTypes
                type={is_high_low ? `${type.toLowerCase()}_barrier` : type.toLowerCase()}
                className='category-type'
                size={24}
            />
        </div>
        <div className='dc-contract-type__type-label'>
            <div>{getContractTypeDisplay(type, is_high_low) || ''}</div>
            {multiplier && <div className='dc-contract-type__type-label-multiplier'>x{multiplier}</div>}
        </div>
    </div>
);

export default ContractTypeCell;
