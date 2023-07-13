import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {
    isCryptocurrency,
    getCancellationPrice,
    getLimitOrderAmount,
    isValidToCancel,
    isValidToSell,
    shouldShowCancellation,
} from '@deriv/shared';
import ContractCardItem from './contract-card-item';
import ToggleCardDialog from './toggle-card-dialog';
import Icon from '../../icon';
import Money from '../../money';

const MultiplierCardBody = ({
    addToast,
    contract_info,
    contract_update,
    connectWithContractUpdate,
    currency,
    current_focus,
    error_message_alignment,
    getCardLabels,
    getContractById,
    has_progress_slider,
    progress_slider,
    is_mobile,
    is_sold,
    onMouseLeave,
    removeToast,
    setCurrentFocus,
    should_show_cancellation_warning,
    status,
    toggleCancellationWarning,
}) => {
    const { buy_price, bid_price, profit, limit_order, underlying } = contract_info;

    const { take_profit, stop_loss } = getLimitOrderAmount(contract_update || limit_order);
    const cancellation_price = getCancellationPrice(contract_info);
    const is_valid_to_cancel = isValidToCancel(contract_info);
    const is_valid_to_sell = isValidToSell(contract_info);
    const {
        BUY_PRICE,
        CURRENT_STAKE,
        DEAL_CANCEL_FEE,
        NOT_AVAILABLE,
        STAKE,
        STOP_LOSS,
        TAKE_PROFIT,
        TOTAL_PROFIT_LOSS,
    } = getCardLabels();

    return (
        <React.Fragment>
            <div
                className={classNames({
                    'dc-contract-card-items-wrapper--mobile': is_mobile,
                    'dc-contract-card-items-wrapper': !is_mobile,
                    'dc-contract-card-items-wrapper--has-progress-slider': has_progress_slider && !is_sold,
                })}
            >
                <ContractCardItem header={STAKE} className='dc-contract-card__stake'>
                    <Money amount={buy_price - cancellation_price} currency={currency} />
                </ContractCardItem>
                <ContractCardItem header={CURRENT_STAKE} className='dc-contract-card__current-stake'>
                    <div
                        className={classNames({
                            'dc-contract-card--profit': +profit > 0,
                            'dc-contract-card--loss': +profit < 0,
                        })}
                    >
                        <Money amount={bid_price} currency={currency} />
                    </div>
                </ContractCardItem>
                <ContractCardItem header={DEAL_CANCEL_FEE} className='dc-contract-card__deal-cancel-fee'>
                    {cancellation_price ? (
                        <Money amount={cancellation_price} currency={currency} />
                    ) : (
                        <React.Fragment>
                            {shouldShowCancellation(underlying) ? <strong>-</strong> : NOT_AVAILABLE}
                        </React.Fragment>
                    )}
                </ContractCardItem>
                <ContractCardItem header={BUY_PRICE} className='dc-contract-card__buy-price'>
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
                            addToast={addToast}
                            connectWithContractUpdate={connectWithContractUpdate}
                            contract_id={contract_info.contract_id}
                            current_focus={current_focus}
                            error_message_alignment={error_message_alignment}
                            getCardLabels={getCardLabels}
                            getContractById={getContractById}
                            is_valid_to_cancel={is_valid_to_cancel}
                            onMouseLeave={onMouseLeave}
                            removeToast={removeToast}
                            setCurrentFocus={setCurrentFocus}
                            should_show_cancellation_warning={should_show_cancellation_warning}
                            status={status}
                            toggleCancellationWarning={toggleCancellationWarning}
                        />
                    )}
                </div>
            </div>
            <ContractCardItem
                className='dc-contract-card-item__total-profit-loss'
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
        </React.Fragment>
    );
};

MultiplierCardBody.propTypes = {
    addToast: PropTypes.func,
    connectWithContractUpdate: PropTypes.func,
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
    status: PropTypes.string,
    toggleCancellationWarning: PropTypes.func,
    has_progress_slider: PropTypes.bool,
};

export default React.memo(MultiplierCardBody);
