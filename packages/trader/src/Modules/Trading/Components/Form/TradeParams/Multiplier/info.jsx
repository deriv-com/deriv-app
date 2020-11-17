import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Money } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const MultipliersInfo = ({ amount, commission, className, currency, multiplier, should_show_tooltip, stop_out }) => {
    const commission_text = (
        <p className='trade-container__multipliers-trade-info-tooltip-text'>
            <Localize
                i18n_default_text='Commission <0/>'
                components={[<Money key={0} amount={commission} currency={currency} show_currency />]}
            />
        </p>
    );

    const stop_out_text = (
        <p className='trade-container__multipliers-trade-info-tooltip-text'>
            <Localize
                i18n_default_text='Stop out <0/>'
                components={[<Money key={0} amount={stop_out} currency={currency} show_currency />]}
            />
        </p>
    );

    const commission_tooltip = (
        <Localize
            i18n_default_text='<0>{{commission_percentage}}%</0> of (<1/> * {{multiplier}})'
            values={{
                commission_percentage: Number((commission * 100) / (multiplier * amount)).toFixed(4),
                multiplier,
            }}
            components={[<span className='bold' key={0} />, <Money key={1} amount={amount} currency={currency} />]}
        />
    );

    const stop_out_tooltip = (
        <Localize
            i18n_default_text='<0>{{commission_percentage}}%</0> of (<1/> * {{multiplier}})'
            values={{
                commission_percentage: Number((commission * 100) / (multiplier * amount)).toFixed(4),
                multiplier,
            }}
            components={[<span className='bold' key={0} />, <Money key={1} amount={amount} currency={currency} />]}
        />
    );

    const getInfo = (elem, message) => {
        return should_show_tooltip ? (
            <Popover alignment='left' message={message} relative_render>
                {elem}
            </Popover>
        ) : (
            elem
        );
    };

    return (
        <div className={classNames('trade-container__multipliers-trade-info', className)}>
            {getInfo(commission_text, commission_tooltip)} {getInfo(stop_out_text, stop_out_tooltip)}
        </div>
    );
};

MultipliersInfo.propTypes = {
    className: PropTypes.string,
    should_show_tooltip: PropTypes.bool,
};

export default connect(({ modules }) => ({
    amount: modules.trade.amount,
    commission: modules.trade.commission,
    currency: modules.trade.currency,
    multiplier: modules.trade.multiplier,
    stop_out: modules.trade.stop_out,
}))(MultipliersInfo);
