import classNames from 'classnames';
import React from 'react';
import { isCryptocurrency, getLimitOrderAmount, isValidToSell } from '@deriv/shared';
import ContractCardItem from './contract-card-item.jsx';
import ToggleCardDialog from './toggle-card-dialog.jsx';
import Icon from '../../icon/index';
import MobileWrapper from '../../mobile-wrapper/index';
import Money from '../../money/index';
import { ResultStatusIcon } from '../result-overlay/result-overlay.jsx';
import { ProposalOpenContract, Proposal, ContractUpdate } from '@deriv/api-types';
import { TIsValidToSell } from '@deriv/shared/src/utils/contract/contract-types';

type TToastConfig = {
    key?: number;
    content: string;
    timeout?: number;
    is_bottom?: boolean;
    type?: string;
};

export type TContractInfo = Pick<ProposalOpenContract, 'buy_price' | 'sell_price' | 'contract_id'> &
    Required<Pick<ProposalOpenContract, 'profit'>> & {
        limit_order?: Proposal['limit_order'];
    } & TIsValidToSell;

type TAccumulatorCardBody = {
    addToast?: (toast_config: TToastConfig) => void;
    connectWithContractUpdate?: (Component: JSX.Element) => unknown;
    contract_info: TContractInfo;
    contract_update: ContractUpdate;
    currency: Required<ProposalOpenContract>['currency'];
    current_focus?: string | null;
    error_message_alignment?: string;
    getCardLabels: () => { [key: string]: string };
    getContractById?: (value: number) => unknown;
    indicative?: number;
    is_sold: ProposalOpenContract['is_sold'];
    onMouseLeave?: () => void;
    removeToast?: (key: number) => void;
    setCurrentFocus?: (value: string) => void;
    status: string;
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
    status,
    is_positions,
}: TAccumulatorCardBody) => {
    const { buy_price, profit, limit_order, sell_price } = contract_info;
    const { take_profit } = getLimitOrderAmount(contract_update || limit_order);
    const is_valid_to_sell = isValidToSell(contract_info);
    const { CURRENT_STAKE, STAKE, TAKE_PROFIT, TOTAL_PROFIT_LOSS } = getCardLabels();

    return (
        <React.Fragment>
            <div className='dc-contract-card-items-wrapper'>
                <ContractCardItem header={STAKE} className='dc-contract-card__stake'>
                    <Money amount={buy_price} currency={currency} />
                </ContractCardItem>
                <ContractCardItem header={CURRENT_STAKE} className='dc-contract-card__current-stake'>
                    <div
                        className={classNames({
                            'dc-contract-card--profit': +profit > 0,
                            'dc-contract-card--loss': +profit < 0,
                        })}
                    >
                        <Money amount={sell_price || indicative} currency={currency} />
                    </div>
                    <div
                        className={classNames('dc-contract-card__indicative--movement', {
                            'dc-contract-card__indicative--movement-complete': is_sold,
                        })}
                    >
                        {status === 'profit' && <Icon icon='IcProfit' />}
                        {status === 'loss' && <Icon icon='IcLoss' />}
                    </div>
                </ContractCardItem>
                <ContractCardItem
                    header={TOTAL_PROFIT_LOSS}
                    is_crypto={isCryptocurrency(currency)}
                    is_loss={+profit < 0}
                    is_won={+profit > 0}
                >
                    <Money amount={profit} currency={currency} />
                    <div
                        className={classNames('dc-contract-card__indicative--movement', {
                            'dc-contract-card__indicative--movement-complete': is_sold,
                        })}
                    >
                        {status === 'profit' && <Icon icon='IcProfit' />}
                        {status === 'loss' && <Icon icon='IcLoss' />}
                    </div>
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
                            status={status}
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
                        <ResultStatusIcon getCardLabels={getCardLabels} is_contract_won={+profit > 0} />
                    </div>
                </MobileWrapper>
            )}
        </React.Fragment>
    );
};

export default React.memo(AccumulatorCardBody);
