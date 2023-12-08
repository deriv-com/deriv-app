import classNames from 'classnames';
import React from 'react';
import { isCryptocurrency, getLimitOrderAmount, isValidToSell } from '@deriv/shared';
import { TContractInfo } from '@deriv/shared/src/utils/contract/contract-types';
import ContractCardItem from './contract-card-item';
import ToggleCardDialog from './toggle-card-dialog';
import MobileWrapper from '../../mobile-wrapper';
import Money from '../../money';
import { ResultStatusIcon } from '../result-overlay/result-overlay';
import { ContractUpdate } from '@deriv/api-types';
import { TToastConfig } from '../../types/contract.types';
import { TGetCardLables } from '../../types/common.types';
import ArrowIndicator from '../../arrow-indicator';

type TAccumulatorCardBody = {
    addToast: (toast_config: TToastConfig) => void;
    connectWithContractUpdate?: React.ComponentProps<typeof ToggleCardDialog>['connectWithContractUpdate'];
    contract_info: TContractInfo;
    contract_update?: ContractUpdate;
    currency: Required<TContractInfo>['currency'];
    current_focus?: string | null;
    error_message_alignment?: string;
    getCardLabels: TGetCardLables;
    getContractById: React.ComponentProps<typeof ToggleCardDialog>['getContractById'];
    indicative?: number;
    is_sold: boolean;
    onMouseLeave?: () => void;
    removeToast: (toast_id: string) => void;
    setCurrentFocus: (value: string) => void;
    is_positions?: boolean;
};

const AccumulatorCardBody = ({
    addToast,
    connectWithContractUpdate,
    contract_info,
    contract_update,
    currency,
    current_focus,
    error_message_alignment,
    getCardLabels,
    getContractById,
    indicative,
    is_sold,
    onMouseLeave,
    removeToast,
    setCurrentFocus,
    is_positions,
}: TAccumulatorCardBody) => {
    const { buy_price, profit, limit_order, sell_price } = contract_info;
    const { take_profit } = getLimitOrderAmount(contract_update || limit_order);
    const is_valid_to_sell = isValidToSell(contract_info);
    const { CURRENT_STAKE, INITIAL_STAKE, TAKE_PROFIT, TOTAL_PROFIT_LOSS } = getCardLabels();
    let is_won, is_loss;
    if (profit) {
        is_won = +profit > 0;
        is_loss = +profit < 0;
    }

    return (
        <React.Fragment>
            <div className='dc-contract-card-items-wrapper'>
                <ContractCardItem header={INITIAL_STAKE} className='dc-contract-card__stake'>
                    <Money amount={buy_price} currency={currency} />
                </ContractCardItem>
                <ContractCardItem header={CURRENT_STAKE} className='dc-contract-card__current-stake'>
                    <div
                        className={classNames({
                            'dc-contract-card--profit': is_won,
                            'dc-contract-card--loss': is_loss,
                        })}
                    >
                        <Money amount={sell_price || indicative} currency={currency} />
                    </div>
                    <ArrowIndicator
                        className='dc-contract-card__indicative--movement'
                        value={sell_price || indicative}
                    />
                </ContractCardItem>
                <ContractCardItem
                    header={TOTAL_PROFIT_LOSS}
                    is_crypto={isCryptocurrency(currency)}
                    is_loss={is_loss}
                    is_won={is_won}
                >
                    <Money amount={profit} currency={currency} />
                    <ArrowIndicator className='dc-contract-card__indicative--movement' value={profit} />
                </ContractCardItem>
                <ContractCardItem header={TAKE_PROFIT} className='dc-contract-card__take-profit'>
                    {take_profit ? <Money amount={take_profit} currency={currency} /> : <strong>-</strong>}
                    {is_valid_to_sell && (
                        <ToggleCardDialog
                            addToast={addToast}
                            connectWithContractUpdate={connectWithContractUpdate}
                            contract_id={contract_info.contract_id}
                            current_focus={current_focus}
                            error_message_alignment={error_message_alignment}
                            getCardLabels={getCardLabels}
                            getContractById={getContractById}
                            is_accumulator
                            onMouseLeave={onMouseLeave}
                            removeToast={removeToast}
                            setCurrentFocus={setCurrentFocus}
                        />
                    )}
                </ContractCardItem>
            </div>
            {!!is_sold && (
                <MobileWrapper>
                    <div
                        className={classNames('dc-contract-card__status', {
                            'dc-contract-card__status--accumulator-mobile-positions': is_positions,
                        })}
                    >
                        <ResultStatusIcon getCardLabels={getCardLabels} is_contract_won={is_won} />
                    </div>
                </MobileWrapper>
            )}
        </React.Fragment>
    );
};

export default React.memo(AccumulatorCardBody);
