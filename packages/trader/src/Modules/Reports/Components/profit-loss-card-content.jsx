import classNames           from 'classnames';
import { Money }            from 'deriv-components';
import PropTypes            from 'prop-types';
import React                from 'react';
import CurrencyUtils        from 'deriv-shared/utils/currency';
import { Localize }         from 'deriv-translations';
import Icon                 from 'Assets/icon.jsx';

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
                { is_sold ? <Localize i18n_default_text='Profit/Loss:' /> : <Localize i18n_default_text='Potential profit/loss:' /> }
            </div>
            <div
                id='dt_profit_loss_label'
                className={classNames(
                    'pl-card__item__body', {
                        'pl-card__item__body--is-crypto': CurrencyUtils.isCryptocurrency(currency),
                        'pl-card__item__body--loss'     : +pl_value < 0,
                        'pl-card__item__body--profit'   : +pl_value > 0,
                    })}
            >
                <Money currency={currency} has_sign={false} amount={pl_value} />
                <div className={classNames(
                    'pl-card__indicative--movement', {
                        'pl-card__indicative--movement-complete': is_sold,
                    },
                )}
                >
                    <Icon
                        icon='IconPriceMove'
                        type={(!is_sold) ? status : null}
                    />
                </div>
            </div>
        </div>
        <div className='pl-card__item-payout'>
            <div className='pl-card__item__header'>
                { is_sold ? <Localize i18n_default_text='Payout:' /> : <Localize i18n_default_text='Indicative price:' /> }
            </div>
            <div id='dt_payout_label' className='pl-card__item__body'>
                <Money currency={currency} amount={payout} />
                <div className={classNames(
                    'pl-card__indicative--movement', {
                        'pl-card__indicative--movement-complete': is_sold,
                    },
                )}
                >
                    <Icon
                        icon='IconPriceMove'
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
