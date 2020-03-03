import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Money } from '@deriv/components';
import CurrencyUtils from '@deriv/shared/utils/currency';
import { localize } from '@deriv/translations';
import { getLimitOrderAmount } from 'Stores/Modules/Contract/Helpers/limit-orders';
import { getCancellationPrice, getIndicativePrice } from 'Stores/Modules/Contract/Helpers/logic';

const MultiplierCardBody = ({ contract_info, currency, status }) => {
    const { buy_price, is_sold, profit, multiplier, limit_order } = contract_info;

    const { take_profit, stop_loss } = getLimitOrderAmount(limit_order);
    const cancellation_price = getCancellationPrice(contract_info);

    return (
        <>
            <div className='positions-drawer-card__grid positions-drawer-card__grid-items'>
                <div className='positions-drawer-card__item'>
                    <span className='positions-drawer-card__item-label'>{localize('Stake:')}</span>
                    <span className='positions-drawer-card__item-value'>
                        <Money amount={buy_price - cancellation_price} currency={currency} />
                    </span>
                </div>
                <div className='positions-drawer-card__item'>
                    <span className='positions-drawer-card__item-label'>
                        {is_sold ? localize('Profit/Loss:') : localize('Potential profit/loss:')}
                    </span>
                    <div
                        className={classNames('positions-drawer-card__profit-loss', {
                            'positions-drawer-card__profit-loss--is-crypto': CurrencyUtils.isCryptocurrency(currency),
                            'positions-drawer-card__profit-loss--negative': profit < 0,
                            'positions-drawer-card__profit-loss--positive': profit > 0,
                        })}
                    >
                        <Money amount={Math.abs(profit)} currency={currency} />
                        <div
                            className={classNames('positions-drawer-card__indicative--movement', {
                                'positions-drawer-card__indicative--movement-complete': !!is_sold,
                            })}
                        >
                            {status === 'profit' && <Icon icon='IcProfit' />}
                            {status === 'loss' && <Icon icon='IcLoss' />}
                        </div>
                    </div>
                </div>
                <div className='positions-drawer-card__item'>
                    <span className='positions-drawer-card__item-label'>{localize('Multiplier:')}</span>
                    <span className='positions-drawer-card__item-value'>x{multiplier}</span>
                </div>
                <div className='positions-drawer-card__item'>
                    <span className='positions-drawer-card__item-label'>{localize('Take profit:')}</span>
                    <span className='positions-drawer-card__item-value'>
                        {take_profit ? <Money amount={take_profit} currency={currency} /> : <strong>-</strong>}
                    </span>
                </div>
                <div className='positions-drawer-card__item'>
                    <span className='positions-drawer-card__item-label'>{localize('Deal cancel. fee:')}</span>
                    <span className='positions-drawer-card__item-value'>
                        {cancellation_price ? (
                            <Money amount={cancellation_price} currency={currency} />
                        ) : (
                            <strong>-</strong>
                        )}
                    </span>
                </div>
                <div className='positions-drawer-card__item'>
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
        </>
    );
};

const CardBody = ({ contract_info, currency, is_multiplier, status }) => {
    const indicative = getIndicativePrice(contract_info);
    const { is_sold, sell_price, profit } = contract_info;

    if (is_multiplier) {
        return <MultiplierCardBody contract_info={contract_info} currency={currency} status={status} />;
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
                    {is_sold ? localize('Profit/Loss:') : localize('Potential profit/loss:')}
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
                        'positions-drawer-card__profit-loss--is-crypto': CurrencyUtils.isCryptocurrency(currency),
                        'positions-drawer-card__profit-loss--negative': profit < 0,
                        'positions-drawer-card__profit-loss--positive': profit > 0,
                    })}
                >
                    <Money amount={Math.abs(profit)} currency={currency} />
                    <div
                        className={classNames('positions-drawer-card__indicative--movement', {
                            'positions-drawer-card__indicative--movement-complete': !!is_sold,
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
                            'positions-drawer-card__indicative--movement-complete': !!is_sold,
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
                    <span className='positions-drawer-card__payout-label'>{localize('Potential payout:')}</span>
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
