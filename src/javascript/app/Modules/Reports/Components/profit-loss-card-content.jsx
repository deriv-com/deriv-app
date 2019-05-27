import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import Localize          from 'App/Components/Elements/localize.jsx';
import Money             from 'App/Components/Elements/money.jsx';
import { IconPriceMove } from 'Assets/Trading/icon-price-move.jsx';

const ProfitLossCardContent = ({
    currency,
    is_sold,
    pl_value,
    payout,
    status,
}) => (
    <div className='pl-card'>
        <div className='pl-card__item'>
            <div className='pl-card__item__header'>
                <Localize str={is_sold ? 'Profit/Loss:' : 'Potential profit/loss'} />
            </div>
            <div className={classNames(
                'pl-card__item__body', {
                    'pl-card__item__body--loss'  : +pl_value < 0,
                    'pl-card__item__body--profit': +pl_value > 0,
                })}
            >
                <Money currency={currency} amount={pl_value} />
                <div className={classNames(
                    'pl-card__indicative--movement', {
                        'pl-card__indicative--movement-complete': is_sold,
                    },
                )}
                >
                    <IconPriceMove
                        type={(!is_sold) ? status : null}
                    />
                </div>
            </div>
        </div>
        <div className='pl-card__item'>
            <div className='pl-card__item__header'>
                <Localize str={is_sold ? 'Payout' : 'Indicative Price:'} />
            </div>
            <div className='pl-card__item__body'>
                <Money currency={currency} amount={payout} />
                <div className={classNames(
                    'pl-card__indicative--movement', {
                        'pl-card__indicative--movement-complete': is_sold,
                    },
                )}
                >
                    <IconPriceMove
                        type={(!is_sold) ? status : null}
                    />
                </div>
            </div>
        </div>
    </div>
);

ProfitLossCardContent.propTypes = {
    currency: PropTypes.string,
    is_sold : PropTypes.bool,
    payout  : PropTypes.number,
    pl_value: PropTypes.number,
    status  : PropTypes.string,
};
export default ProfitLossCardContent;
