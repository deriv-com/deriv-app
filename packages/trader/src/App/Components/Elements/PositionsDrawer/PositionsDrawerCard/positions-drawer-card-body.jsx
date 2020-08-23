import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Money } from '@deriv/components';
import { isCryptocurrency } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { getLimitOrderAmount } from 'Stores/Modules/Contract/Helpers/limit-orders';
import { getCancellationPrice, getIndicativePrice } from 'Stores/Modules/Contract/Helpers/logic';

const MultiplierCardBody = ({ contract_info, contract_update, currency, status }) => {
    const { buy_price, bid_price, is_sold, profit } = contract_info;

    const total_profit = bid_price - buy_price;
    const { take_profit, stop_loss } = getLimitOrderAmount(contract_update);
    const cancellation_price = getCancellationPrice(contract_info);

    return (
        <>
            <div className='positions-drawer-card__grid positions-drawer-card__grid-items'>
                <div className='positions-drawer-card__item positions-drawer-card__stake'>
                    <span className='positions-drawer-card__item-label'>{localize('Stake:')}</span>
                    <span className='positions-drawer-card__item-value'>
                        <Money amount={buy_price - cancellation_price} currency={currency} />
                    </span>
                </div>
                <div className='positions-drawer-card__item positions-drawer-card__current-stake'>
                    <span className='positions-drawer-card__item-label'>{localize('Current stake:')}</span>
                    <span
                        className={classNames('positions-drawer-card__item-value', {
                            'positions-drawer-card__profit-loss--is-crypto': isCryptocurrency(currency),
                            'positions-drawer-card--loss': profit < 0,
                            'positions-drawer-card--profit': profit > 0,
                        })}
                    >
                        <Money amount={bid_price} currency={currency} />
                    </span>
                </div>
                <div className='positions-drawer-card__item positions-drawer-card__deal-cancel-fee'>
                    <span className='positions-drawer-card__item-label'>{localize('Deal cancel. fee:')}</span>
                    <span className='positions-drawer-card__item-value'>
                        {cancellation_price ? (
                            <Money amount={cancellation_price} currency={currency} />
                        ) : (
                            <strong>-</strong>
                        )}
                    </span>
                </div>
                <div className='positions-drawer-card__item positions-drawer-card__take-profit'>
                    <span className='positions-drawer-card__item-label'>{localize('Take profit:')}</span>
                    <span className='positions-drawer-card__item-value'>
                        {take_profit ? <Money amount={take_profit} currency={currency} /> : <strong>-</strong>}
                    </span>
                </div>
                <div className='positions-drawer-card__item positions-drawer-card__buy-price'>
                    <span className='positions-drawer-card__item-label'>{localize('Buy price:')}</span>
                    <span className='positions-drawer-card__item-value'>
                        <Money amount={buy_price} currency={currency} />
                    </span>
                </div>
                <div className='positions-drawer-card__item positions-drawer-card__stop-loss'>
                    <span className='positions-drawer-card__item-label'>{localize('Stop loss:')}</span>
                    <span className='positions-drawer-card__item-value'>
                        {stop_loss ? (
                            <React.Fragment>
                                <strong>-</strong>
                                <Money amount={stop_loss} currency={currency} />
                            </React.Fragment>
                        ) : (
                            <strong>-</strong>
                        )}
                    </span>
                </div>
            </div>
            <div className='positions-drawer-card__total-profit-loss'>
                <span className='positions-drawer-card__total-profit-loss-label'>{localize('Total profit/loss:')}</span>
                <div
                    className={classNames(
                        ' positions-drawer-card__profit-loss positions-drawer-card__total-profit-loss-value',
                        {
                            'positions-drawer-card__profit-loss--is-crypto': isCryptocurrency(currency),
                            'positions-drawer-card__profit-loss--negative': total_profit < 0,
                            'positions-drawer-card__profit-loss--positive': total_profit > 0,
                        }
                    )}
                >
                    <Money amount={total_profit} currency={currency} />
                    <div
                        className={classNames('positions-drawer-card__indicative--movement', {
                            'positions-drawer-card__indicative--movement-complete': is_sold,
                        })}
                    >
                        {status === 'profit' && <Icon icon='IcProfit' />}
                        {status === 'loss' && <Icon icon='IcLoss' />}
                    </div>
                </div>
            </div>
        </>
    );
};

const CardBody = ({ contract_info, contract_update, currency, is_multiplier, status }) => {
    const indicative = getIndicativePrice(contract_info);
    const { is_sold, sell_price, profit } = contract_info;

    if (is_multiplier) {
        return (
            <MultiplierCardBody
                contract_info={contract_info}
                contract_update={contract_update}
                currency={currency}
                status={status}
            />
        );
    }

    return (
        <>
            <div className={classNames('positions-drawer-card__grid', 'positions-drawer-card__grid-profit-payout')}>
                <div
                    className={classNames(
                        'positions-drawer-card__profit-loss',
                        'positions-drawer-card__profit-loss-label'
                    )}
                >
                    {is_sold ? localize('Profit/Loss:') : localize('Indicative profit/loss:')}
                </div>
                <div
                    className={classNames(
                        'positions-drawer-card__indicative',
                        'positions-drawer-card__indicative-label'
                    )}
                >
                    {!is_sold ? localize('Indicative price:') : localize('Payout:')}
                </div>
                <div
                    className={classNames('positions-drawer-card__profit-loss', {
                        'positions-drawer-card__profit-loss--is-crypto': isCryptocurrency(currency),
                        'positions-drawer-card__profit-loss--negative': profit < 0,
                        'positions-drawer-card__profit-loss--positive': profit > 0,
                    })}
                >
                    <Money amount={Math.abs(profit)} currency={currency} />
                    <div
                        className={classNames('positions-drawer-card__indicative--movement', {
                            'positions-drawer-card__indicative--movement-complete': is_sold,
                        })}
                    >
                        {status === 'profit' && <Icon icon='IcProfit' />}
                        {status === 'loss' && <Icon icon='IcLoss' />}
                    </div>
                </div>
                <div className='positions-drawer-card__indicative'>
                    <Money amount={sell_price || indicative} currency={currency} />
                    <div
                        className={classNames('positions-drawer-card__indicative--movement', {
                            'positions-drawer-card__indicative--movement-complete': is_sold,
                        })}
                    >
                        {status === 'profit' && <Icon icon='IcProfit' />}
                        {status === 'loss' && <Icon icon='IcLoss' />}
                    </div>
                </div>
            </div>
            <div className={classNames('positions-drawer-card__grid', 'positions-drawer-card__grid-price-payout')}>
                <div className='positions-drawer-card__purchase-price'>
                    <span className='positions-drawer-card__purchase-label'>{localize('Purchase price:')}</span>
                    <span className='positions-drawer-card__purchase-value'>
                        <Money amount={contract_info.buy_price} currency={currency} />
                    </span>
                </div>
                <div className='positions-drawer-card__payout-price'>
                    <span className='positions-drawer-card__payout-label'>{localize('Payout limit:')}</span>
                    <span className='positions-drawer-card__payout-value'>
                        {contract_info.payout ? (
                            <Money amount={contract_info.payout} currency={currency} />
                        ) : (
                            <strong>-</strong>
                        )}
                    </span>
                </div>
            </div>
        </>
    );
};

CardBody.propTypes = {
    contract_info: PropTypes.object,
    currency: PropTypes.string,
    is_multiplier: PropTypes.bool,
    status: PropTypes.string,
};

export default CardBody;
