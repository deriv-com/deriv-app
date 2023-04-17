import classNames from 'classnames';
import React from 'react';
import { isCryptocurrency, getLimitOrderAmount, isValidToSell, addComma } from '@deriv/shared';
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
        bid_price,
        buy_price,
        profit,
        barrier,
        entry_spot_display_value,
        limit_order = {},
        sell_price,
    } = contract_info;
    const { take_profit } = getLimitOrderAmount(contract_update || limit_order);
    const is_valid_to_sell = isValidToSell(contract_info);
    const contract_value = is_sold ? sell_price : bid_price;
    const { BARRIER, CONTRACT_VALUE, ENTRY_SPOT, TAKE_PROFIT, TOTAL_PROFIT_LOSS, PURCHASE_PRICE } = getCardLabels();

    return (
        <React.Fragment>
            <div className={classNames('dc-contract-card-items-wrapper dc-contract-card--turbos')}>
                <ContractCardItem
                    className='dc-contract-card__buy-price'
                    is_crypto={isCryptocurrency(currency)}
                    header={PURCHASE_PRICE}
                >
                    <Money amount={buy_price} currency={currency} />
                </ContractCardItem>
                <ContractCardItem header={CONTRACT_VALUE} className='dc-contract-card__contract-value'>
                    <Money amount={contract_value} currency={currency} />
                </ContractCardItem>
                <ContractCardItem
                    header={ENTRY_SPOT}
                    is_crypto={isCryptocurrency(currency)}
                    className='dc-contract-card__entry-spot'
                >
                    <Money amount={`${entry_spot_display_value}`} />
                </ContractCardItem>

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
                <ContractCardItem header={BARRIER} className='dc-contract-card__barrier-level'>
                    <Money amount={addComma(barrier)} currency={currency} should_format={false} />
                </ContractCardItem>
                <MobileWrapper>
                    <div className='dc-contract-card__status'>
                        {is_sold ? (
                            <ResultStatusIcon getCardLabels={getCardLabels} is_contract_won={profit && profit > 0} />
                        ) : (
                            progress_slider_mobile_el
                        )}
                    </div>
                </MobileWrapper>
            </div>
            {!!profit && (
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
