import React from 'react';
import classNames from 'classnames';
import { isOpen, isValidToSell, hasContractEntered } from '@deriv/shared';
import Button from '../../button';

type ContractCardSellProps = {
    contract_info: unknown;
    getCardLabels: () => void;
    is_sell_requested: unknown;
    onClickSell: () => void;
};

const ContractCardSell = ({ contract_info, is_sell_requested, onClickSell, getCardLabels }: ContractCardSellProps) => {
    const is_valid_to_sell = isValidToSell(contract_info);
    const should_show_sell = hasContractEntered(contract_info) && isOpen(contract_info);

    const onClick = ev => {
        onClickSell(contract_info.contract_id);
        ev.stopPropagation();
        ev.preventDefault();
    };

    return (
        should_show_sell && (
            <React.Fragment>
                {is_valid_to_sell ? (
                    <Button
                        className={classNames('dc-btn--sell', {
                            'dc-btn--loading': is_sell_requested,
                        })}
                        is_disabled={is_sell_requested}
                        text={getCardLabels().SELL}
                        onClick={onClick}
                        secondary
                    />
                ) : (
                    <div className='dc-contract-card__no-resale-msg'>{getCardLabels().RESALE_NOT_OFFERED}</div>
                )}
            </React.Fragment>
        )
    );
};

export default ContractCardSell;
