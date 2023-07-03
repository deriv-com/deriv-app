import React from 'react';
import { TGetContractTypeDisplay } from '../../types';
import IconTradeTypes from '../../icon-trade-types';
import { isVanillaContract } from '@deriv/shared';

export type TContractTypeCellProps = {
    getContractTypeDisplay: TGetContractTypeDisplay;
    is_high_low: boolean;
    multiplier?: number;
    type?: string;
    displayed_trade_param?: string;
};

const ContractTypeCell = ({
    displayed_trade_param,
    getContractTypeDisplay,
    is_high_low,
    type = '',
}: TContractTypeCellProps) => (
    <div className='dc-contract-type'>
        <div className='dc-contract-type__type-wrapper'>
            <IconTradeTypes
                type={is_high_low && !isVanillaContract(type) ? `${type.toLowerCase()}_barrier` : type.toLowerCase()}
                className='category-type'
                size={24}
            />
        </div>
        <div className='dc-contract-type__type-label'>
            <div>{getContractTypeDisplay(type, is_high_low) || ''}</div>
            {displayed_trade_param && (
                <div className='dc-contract-type__type-label-trade-param'>{displayed_trade_param}</div>
            )}
        </div>
    </div>
);

export default ContractTypeCell;
