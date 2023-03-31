import classNames from 'classnames';
import React from 'react';
import { isCryptocurrency, getLimitOrderAmount, isValidToSell } from '@deriv/shared';
import ContractCardItem from './contract-card-item.jsx';
import ToggleCardDialog from './toggle-card-dialog.jsx';
import Icon from '../../icon';
import MobileWrapper from '../../mobile-wrapper';
import Money from '../../money';
import { ResultStatusIcon } from '../result-overlay/result-overlay.jsx';
import { TContractInfo, TGetContractUpdateConfig } from '@deriv/shared/src/utils/contract/contract-types';
import { TContractStore } from '@deriv/shared/src/utils/helpers/validation-rules';

type TToastConfig = {
    key?: string;
    content: string;
    timeout?: number;
    is_bottom?: boolean;
    type: string;
};

type TTurbosCardBody = {
    addToast: (toast_config: TToastConfig) => void;
    connectWithContractUpdate?: (Component: React.ComponentType) => React.ComponentType;
    contract_info: TContractInfo;
    contract_update?: TGetContractUpdateConfig['contract_update'];
    currency: string;
    current_focus?: string | null;
    error_message_alignment?: string;
    getCardLabels: () => { [key: string]: string };
    getContractById: (contract_id: number) => TContractStore;
    is_sold: boolean;
    onMouseLeave: () => void;
    removeToast: (key: string) => void;
    progress_slider_mobile_el: React.ReactNode;
    setCurrentFocus: (value: string | null) => void;
    status: string | null;
};

const TurbosCardBody = ({
    addToast,
    connectWithContractUpdate,
    contract_info,
    contract_update,
    currency,
    current_focus,
    error_message_alignment,
    getCardLabels,
    getContractById,
    is_sold,
    onMouseLeave,
    removeToast,
    progress_slider_mobile_el,
    setCurrentFocus,
    status,
}: TTurbosCardBody) => {
    const {
        buy_price,
        profit,
        barrier,
        current_spot_display_value,
        limit_order = {},
        sell_spot,
        entry_spot,
    } = contract_info;
    const { take_profit } = getLimitOrderAmount(contract_update || limit_order);
    const is_valid_to_sell = isValidToSell(contract_info);
    const { BARRIER_LEVEL, BUY_PRICE, CURRENT_PRICE, STAKE, TAKE_PROFIT, TOTAL_PROFIT_LOSS, PAYOUT, PROFIT_LOSS } =
        getCardLabels();

    return (
        <React.Fragment>
            <div className={classNames('dc-contract-card-items-wrapper dc-contract-card--turbos')}>
                <ContractCardItem
                    className='dc-contract-card__stake'
                    header={is_sold ? PROFIT_LOSS : STAKE}
                    is_crypto={isCryptocurrency(currency)}
                    is_loss={is_sold && profit ? profit < 0 : false}
                    is_won={is_sold && profit ? profit > 0 : false}
                >
                    <Money amount={buy_price} currency={currency} />
                </ContractCardItem>
                <ContractCardItem header={is_sold ? PAYOUT : CURRENT_PRICE} className='dc-contract-card__current-price'>
                    <Money currency={currency} amount={sell_spot || current_spot_display_value} />
                </ContractCardItem>
                <ContractCardItem
                    header={is_sold ? BUY_PRICE : BARRIER_LEVEL}
                    is_crypto={isCryptocurrency(currency)}
                    className='dc-contract-card__buy-price'
                >
                    <Money amount={is_sold ? entry_spot : barrier} currency={currency} />
                </ContractCardItem>
                {is_sold ? (
                    <ContractCardItem header={BARRIER_LEVEL} className='dc-contract-card__barrier-level'>
                        <Money amount={barrier} currency={currency} />
                    </ContractCardItem>
                ) : (
                    <div className='dc-contract-card__limit-order-info'>
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
                                    is_turbos
                                    onMouseLeave={onMouseLeave}
                                    removeToast={removeToast}
                                    setCurrentFocus={setCurrentFocus}
                                    status={status}
                                />
                            )}
                        </ContractCardItem>
                    </div>
                )}
                <MobileWrapper>
                    <div className='dc-contract-card__status'>
                        {is_sold && !!profit ? (
                            <ResultStatusIcon getCardLabels={getCardLabels} is_contract_won={profit > 0} />
                        ) : (
                            !is_sold && progress_slider_mobile_el
                        )}
                    </div>
                </MobileWrapper>
            </div>
            {!is_sold && !!profit && (
                <ContractCardItem
                    className='dc-contract-card-item__total-profit-loss'
                    header={TOTAL_PROFIT_LOSS}
                    is_crypto={isCryptocurrency(currency)}
                    is_loss={profit < 0}
                    is_won={profit > 0}
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
            )}
        </React.Fragment>
    );
};

export default React.memo(TurbosCardBody);
