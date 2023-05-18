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
}: TContractTypeCellProps) => {
    let bug_type = '';
    if (type === 'CALL') {
        bug_type = 'PUT';
    } else if (type === 'PUT') {
        bug_type = 'CALL';
    } else {
        bug_type = 'MULTUP';
    }
    return (
        <div className='dc-contract-type'>
            <div className='dc-contract-type__type-wrapper'>
                <IconTradeTypes
                    type={
                        is_high_low && !isVanillaContract(bug_type)
                            ? `${bug_type.toLowerCase()}_barrier`
                            : bug_type.toLowerCase()
                    }
                    className='category-type'
                    size={24}
                />
            </div>
            <div className='dc-contract-type__type-label'>
                <div>{getContractTypeDisplay(bug_type, is_high_low) || ''}</div>
                {displayed_trade_param && (
                    <div className='dc-contract-type__type-label-trade-param'>{displayed_trade_param}</div>
                )}
            </div>
        </div>
    );
};

export default ContractTypeCell;
