import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {
    isCryptocurrency,
    getCancellationPrice,
    getIndicativePrice,
    getLimitOrderAmount,
    getCurrentTick,
    getDisplayStatus,
} from '@deriv/shared';
import ContractCardItem from './contract-card-item.jsx';
import Money from '../../money';
import Icon from '../../icon';
import MobileWrapper from '../../mobile-wrapper';
import { ResultStatusIcon } from '../result-overlay/result-overlay.jsx';
import ProgressSliderMobile from '../../progress-slider-mobile';

const MultiplierCardBody = ({
    contract_info,
    contract_update,
    currency,
    getCardLabels,
    is_mobile,
    is_sold,
    status,
}) => {
    const { buy_price, bid_price, profit, limit_order } = contract_info;

    const total_profit = bid_price - buy_price;
    const { take_profit, stop_loss } = getLimitOrderAmount(contract_update || limit_order);
    const cancellation_price = getCancellationPrice(contract_info);

    return (
        <React.Fragment>
            <div
                className={classNames({
                    'dc-contract-card-items-wrapper--mobile': is_mobile,
                    'dc-contract-card-items-wrapper': !is_mobile,
                })}
            >
                <ContractCardItem header={getCardLabels().STAKE} className='dc-contract-card__stake'>
                    <Money amount={buy_price - cancellation_price} currency={currency} />
                </ContractCardItem>
                <ContractCardItem header={getCardLabels().CURRENT_STAKE} className='dc-contract-card__current-stake'>
                    <div
                        className={classNames({
                            'dc-contract-card--profit': +profit > 0,
                            'dc-contract-card--loss': +profit < 0,
                        })}
                    >
                        <Money amount={bid_price} currency={currency} />
                    </div>
                </ContractCardItem>
                <ContractCardItem
                    header={getCardLabels().DEAL_CANCEL_FEE}
                    className='dc-contract-card__deal-cancel-fee'
                >
                    {cancellation_price ? (
                        <Money amount={cancellation_price} currency={currency} />
                    ) : (
                        <strong>-</strong>
                    )}
                </ContractCardItem>
                <ContractCardItem header={getCardLabels().TAKE_PROFIT} className='dc-contract-card__take-profit'>
                    {take_profit ? <Money amount={take_profit} currency={currency} /> : <strong>-</strong>}
                </ContractCardItem>
                <ContractCardItem header={getCardLabels().BUY_PRICE} className='dc-contract-card__buy-price'>
                    <Money amount={buy_price} currency={currency} />
                </ContractCardItem>
                <ContractCardItem header={getCardLabels().STOP_LOSS} className='dc-contract-card__stop-loss'>
                    {stop_loss ? (
                        <React.Fragment>
                            <strong>-</strong>
                            <Money amount={stop_loss} currency={currency} />
                        </React.Fragment>
                    ) : (
                        <strong>-</strong>
                    )}
                </ContractCardItem>
            </div>
            <ContractCardItem
                className='dc-contract-card-item__total-profit-loss'
                header={getCardLabels().TOTAL_PROFIT_LOSS}
                is_crypto={isCryptocurrency(currency)}
                is_loss={+total_profit < 0}
                is_won={+total_profit > 0}
            >
                <Money amount={total_profit} currency={currency} />
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

const ContractCardBody = ({
    contract_info,
    contract_update,
    currency,
    getCardLabels,
    is_mobile,
    is_multiplier,
    is_sold,
    status,
    server_time,
}) => {
    const indicative = getIndicativePrice(contract_info);
    const { buy_price, sell_price, payout, profit, tick_count, date_expiry, purchase_time } = contract_info;
    const current_tick = tick_count ? getCurrentTick(contract_info) : null;

    if (is_multiplier) {
        return (
            <MultiplierCardBody
                contract_info={contract_info}
                contract_update={contract_update}
                currency={currency}
                getCardLabels={getCardLabels}
                is_mobile={is_mobile}
                is_sold={is_sold}
                status={status}
            />
        );
    }

    return (
        <>
            <div className='dc-contract-card-items-wrapper'>
                <ContractCardItem
                    header={is_sold ? getCardLabels().PROFIT_LOSS : getCardLabels().POTENTIAL_PROFIT_LOSS}
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
                <ContractCardItem header={is_sold ? getCardLabels().PAYOUT : getCardLabels().INDICATIVE_PRICE}>
                    <Money currency={currency} amount={sell_price || indicative} />
                    <div
                        className={classNames('dc-contract-card__indicative--movement', {
                            'dc-contract-card__indicative--movement-complete': is_sold,
                        })}
                    >
                        {status === 'profit' && <Icon icon='IcProfit' />}
                        {status === 'loss' && <Icon icon='IcLoss' />}
                    </div>
                </ContractCardItem>
                <ContractCardItem header={getCardLabels().PURCHASE_PRICE}>
                    <Money amount={buy_price} currency={currency} />
                </ContractCardItem>
                <ContractCardItem header={getCardLabels().POTENTIAL_PAYOUT}>
                    <Money currency={currency} amount={payout} />
                </ContractCardItem>
            </div>
            <MobileWrapper>
                <div className='dc-contract-card__status'>
                    {is_sold ? (
                        <ResultStatusIcon
                            getCardLabels={getCardLabels}
                            is_contract_won={getDisplayStatus(contract_info) === 'won'}
                        />
                    ) : (
                        <ProgressSliderMobile
                            current_tick={current_tick}
                            expiry_time={date_expiry}
                            getCardLabels={getCardLabels}
                            is_loading={false}
                            server_time={server_time}
                            start_time={purchase_time}
                            ticks_count={tick_count}
                        />
                    )}
                </div>
            </MobileWrapper>
        </>
    );
};

ContractCardBody.propTypes = {
    contract_info: PropTypes.object,
    currency: PropTypes.string,
    getCardLabels: PropTypes.func,
    is_mobile: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    is_sold: PropTypes.bool,
    status: PropTypes.string,
    server_time: PropTypes.object,
};

export default ContractCardBody;
