import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {
    isCryptocurrency,
    getCancellationPrice,
    getLimitOrderAmount,
    getTotalProfit,
    isValidToCancel,
    isValidToSell,
} from '@deriv/shared';
import ContractCardItem from './contract-card-item';
import ToggleCardDialog from './toggle-card-dialog';
import Money from '../../money';
import ArrowIndicator from '../../arrow-indicator';

const MultiplierCardBody = ({
    contract_info,
    contract_update,
    currency,
    getCardLabels,
    has_progress_slider,
    progress_slider,
    is_mobile,
    is_sold,
    should_show_cancellation_warning,
    toggleCancellationWarning,
    ...toggle_card_dialog_props
}) => {
    const { buy_price, bid_price, limit_order } = contract_info;
    const { take_profit, stop_loss } = getLimitOrderAmount(contract_update || limit_order);
    const cancellation_price = getCancellationPrice(contract_info);
    const is_valid_to_cancel = isValidToCancel(contract_info);
    const is_valid_to_sell = isValidToSell(contract_info);
    const total_profit = getTotalProfit(contract_info);
    const { CONTRACT_COST, CONTRACT_VALUE, DEAL_CANCEL_FEE, STAKE, STOP_LOSS, TAKE_PROFIT, TOTAL_PROFIT_LOSS } =
        getCardLabels();

    return (
        <React.Fragment>
            <div
                className={classNames({
                    'dc-contract-card-items-wrapper--mobile': is_mobile,
                    'dc-contract-card-items-wrapper': !is_mobile,
                    'dc-contract-card-items-wrapper--has-progress-slider': has_progress_slider && !is_sold,
                })}
                data-testid='dt_multiplier_card_body'
            >
                <ContractCardItem header={CONTRACT_COST} className='dc-contract-card__stake'>
                    <Money amount={buy_price - cancellation_price} currency={currency} />
                </ContractCardItem>
                <ContractCardItem header={CONTRACT_VALUE} className='dc-contract-card__current-stake'>
                    <div
                        className={classNames({
                            'dc-contract-card--profit': total_profit > 0,
                            'dc-contract-card--loss': total_profit < 0,
                        })}
                    >
                        <Money amount={bid_price} currency={currency} />
                    </div>
                    {!is_sold && (
                        <ArrowIndicator className='dc-contract-card__indicative--movement' value={total_profit} />
                    )}
                </ContractCardItem>
                <ContractCardItem
                    header={DEAL_CANCEL_FEE}
                    className={classNames('dc-contract-card__deal-cancel-fee', {
                        'dc-contract-card__deal-cancel-fee__disabled': !cancellation_price,
                    })}
                >
                    {cancellation_price ? (
                        <Money amount={cancellation_price} currency={currency} />
                    ) : (
                        <React.Fragment>-</React.Fragment>
                    )}
                </ContractCardItem>
                <ContractCardItem header={STAKE} className='dc-contract-card__buy-price'>
                    <Money amount={buy_price} currency={currency} />
                </ContractCardItem>
                {has_progress_slider && is_mobile && !is_sold && (
                    <ContractCardItem className='dc-contract-card__date-expiry'>{progress_slider}</ContractCardItem>
                )}
                <div className='dc-contract-card__limit-order-info'>
                    <ContractCardItem header={TAKE_PROFIT} className='dc-contract-card__take-profit'>
                        {take_profit ? <Money amount={take_profit} currency={currency} /> : <strong>-</strong>}
                    </ContractCardItem>
                    <ContractCardItem header={STOP_LOSS} className='dc-contract-card__stop-loss'>
                        {stop_loss ? (
                            <React.Fragment>
                                <strong>-</strong>
                                <Money amount={stop_loss} currency={currency} />
                            </React.Fragment>
                        ) : (
                            <strong>-</strong>
                        )}
                    </ContractCardItem>
                    {(is_valid_to_sell || is_valid_to_cancel) && (
                        <ToggleCardDialog
                            contract_id={contract_info.contract_id}
                            getCardLabels={getCardLabels}
                            is_risk_management_edition_disabled={is_valid_to_cancel}
                            should_show_warning={should_show_cancellation_warning}
                            toggleCancellationWarning={toggleCancellationWarning}
                            {...toggle_card_dialog_props}
                        />
                    )}
                </div>
            </div>
            <ContractCardItem
                className='dc-contract-card-item__total-profit-loss'
                header={TOTAL_PROFIT_LOSS}
                is_crypto={isCryptocurrency(currency)}
                is_loss={total_profit < 0}
                is_won={total_profit > 0}
            >
                <Money amount={Math.abs(total_profit)} currency={currency} />
                {!is_sold && <ArrowIndicator className='dc-contract-card__indicative--movement' value={total_profit} />}
            </ContractCardItem>
        </React.Fragment>
    );
};

MultiplierCardBody.propTypes = {
    addToast: PropTypes.func,
    contract_info: PropTypes.object,
    contract_update: PropTypes.object,
    currency: PropTypes.string,
    current_focus: PropTypes.string,
    error_message_alignment: PropTypes.string,
    getCardLabels: PropTypes.func,
    getContractById: PropTypes.func,
    is_mobile: PropTypes.bool,
    is_sold: PropTypes.bool,
    onMouseLeave: PropTypes.func,
    progress_slider: PropTypes.node,
    removeToast: PropTypes.func,
    setCurrentFocus: PropTypes.func,
    should_show_cancellation_warning: PropTypes.bool,
    toggleCancellationWarning: PropTypes.func,
    totalProfit: PropTypes.number.isRequired,
    has_progress_slider: PropTypes.bool,
};

export default React.memo(MultiplierCardBody);
