import classNames      from 'classnames';
import PropTypes       from 'prop-types';
import React           from 'react';
import Localize        from 'App/Components/Elements/localize.jsx';
import Money           from 'App/Components/Elements/money.jsx';

const ProfitLossCardContent = ({
    currency,
    pl_value,
    payout,
}) => (
    <div className='pl-card'>
        <div className='pl-card__item'>
            <div className='pl-card__item__header'>
                <Localize str='P/L:' />
            </div>
            <div className={classNames(
                'pl-card__item__body', {
                    'pl-card__item__body--loss'  : +pl_value < 0,
                    'pl-card__item__body--profit': +pl_value > 0,
                })}
            >
                <Money currency={currency} amount={pl_value} />
            </div>
        </div>
        <div className='pl-card__item'>
            <div className='pl-card__item__header'>
                <Localize str='Payout:' />
            </div>
            <div className='pl-card__item__body'>
                <Money currency={currency} amount={payout} />
            </div>
        </div>
    </div>
);

ProfitLossCardContent.propTypes = {
    currency: PropTypes.string,
    payout  : PropTypes.number,
    pl_value: PropTypes.number,
};
export default ProfitLossCardContent;
