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
import ProgressSliderMobile from '../progress-slider-mobile';

const MultiplierCardBody = ({ contract_info, contract_update, currency, status, card_labels }) => {
    const { buy_price, bid_price, is_sold, profit } = contract_info;

    const total_profit = bid_price - buy_price;
    const { take_profit, stop_loss } = getLimitOrderAmount(contract_update);
    const cancellation_price = getCancellationPrice(contract_info);

    return (
        <div className='contract-card__body-wrapper'>
            <div className='contract-card-items-wrapper'>
                <ContractCardItem header={card_labels.STAKE}>
                    <Money amount={buy_price - cancellation_price} currency={currency} />
                </ContractCardItem>
                <ContractCardItem header={card_labels.CURRENT_STAKE}>
                    <div
                        className={classNames({
                            'contract-card--profit': +profit > 0,
                            'contract-card--loss': +profit < 0,
                        })}
                    >
                        <Money amount={bid_price} currency={currency} />
                    </div>
                </ContractCardItem>
                <ContractCardItem header={card_labels.DEAL_CANCEL_FEE}>
                    {cancellation_price ? (
                        <Money amount={cancellation_price} currency={currency} />
                    ) : (
                        <strong>-</strong>
                    )}
                </ContractCardItem>
                <ContractCardItem header={card_labels.TAKE_PROFIT}>
                    {take_profit ? <Money amount={take_profit} currency={currency} /> : <strong>-</strong>}
                </ContractCardItem>
                <ContractCardItem header={card_labels.BUY_PRICE}>
                    <Money amount={buy_price} currency={currency} />
                </ContractCardItem>
                <ContractCardItem header={card_labels.STOP_LOSS}>
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
                className='contract-card-item__total-profit-loss'
                header={card_labels.TOTAL_PROFIT_LOSS}
                is_crypto={isCryptocurrency(currency)}
                is_loss={+total_profit < 0}
                is_won={+total_profit > 0}
            >
                <Money amount={total_profit} currency={currency} />
                <div
                    className={classNames('contract-card__indicative--movement', {
                        'contract-card__indicative--movement-complete': is_sold,
                    })}
                >
                    {status === 'profit' && <Icon icon='IcProfit' />}
                    {status === 'loss' && <Icon icon='IcLoss' />}
                </div>
            </ContractCardItem>
        </div>
    );
};

const ContractCardBody = ({
    contract_info,
    contract_update,
    currency,
    is_multiplier,
    status,
    server_time,
    card_labels,
}) => {
    const indicative = getIndicativePrice(contract_info);
    const { buy_price, is_sold, sell_price, payout, profit, tick_count, date_expiry, purchase_time } = contract_info;
    const current_tick = tick_count ? getCurrentTick(contract_info) : null;

    if (is_multiplier) {
        return (
            <MultiplierCardBody
                contract_info={contract_info}
                contract_update={contract_update}
                currency={currency}
                status={status}
                card_labels={card_labels}
            />
        );
    }

    return (
        <>
            <div className='contract-card-items-wrapper'>
                <ContractCardItem
                    header={is_sold ? card_labels.PROFIT_LOSS : card_labels.POTENTIAL_PROFIT_LOSS}
                    is_crypto={isCryptocurrency(currency)}
                    is_loss={+profit < 0}
                    is_won={+profit > 0}
                >
                    <Money amount={profit} currency={currency} />
                    <div
                        className={classNames('contract-card__indicative--movement', {
                            'contract-card__indicative--movement-complete': is_sold,
                        })}
                    >
                        {status === 'profit' && <Icon icon='IcProfit' />}
                        {status === 'loss' && <Icon icon='IcLoss' />}
                    </div>
                </ContractCardItem>
                <ContractCardItem header={is_sold ? card_labels.PAYOUT : card_labels.INDICATIVE_PRICE}>
                    <Money currency={currency} amount={sell_price || indicative} />
                    <div
                        className={classNames('contract-card__indicative--movement', {
                            'contract-card__indicative--movement-complete': is_sold,
                        })}
                    >
                        {status === 'profit' && <Icon icon='IcProfit' />}
                        {status === 'loss' && <Icon icon='IcLoss' />}
                    </div>
                </ContractCardItem>
                <ContractCardItem header={card_labels.PURCHASE_PRICE}>
                    <Money amount={buy_price} currency={currency} />
                </ContractCardItem>
                <ContractCardItem header={card_labels.POTENTIAL_PAYOUT}>
                    <Money currency={currency} amount={payout} />
                </ContractCardItem>
            </div>
            <MobileWrapper>
                <div className='contract-card__status'>
                    {is_sold ? (
                        <ResultStatusIcon
                            is_contract_won={getDisplayStatus(contract_info) === 'won'}
                            card_labels={card_labels}
                        />
                    ) : (
                        <ProgressSliderMobile
                            current_tick={current_tick}
                            expiry_time={date_expiry}
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
    is_multiplier: PropTypes.bool,
    status: PropTypes.string,
};

export default ContractCardBody;
