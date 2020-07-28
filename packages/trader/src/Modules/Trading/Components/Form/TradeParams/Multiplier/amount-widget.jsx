import React from 'react';
import { Money, Icon } from '@deriv/components';
import { connect } from 'Stores/connect';
import { localize, Localize } from '@deriv/translations';
import MultiplierTradeParamsModal from 'Modules/Trading/Containers/Multiplier/multiplier-trade-params-modal.jsx';

const AmountWidget = ({ amount, currency, multiplier }) => {
    const [is_open, setIsOpen] = React.useState(false);

    const toggleModal = () => {
        setIsOpen(!is_open);
    };

    return (
        <React.Fragment>
            <MultiplierTradeParamsModal is_open={is_open} toggleModal={toggleModal} />
            <div className='mobile-widget mobile-widget__multiplier-amount' onClick={toggleModal}>
                <div className='mobile-widget__item'>
                    <span className='mobile-widget__item-label'>{localize('Stake')}</span>
                    <span className='mobile-widget__item-value'>
                        <Money amount={amount} currency={currency} />
                    </span>
                </div>
                <div className='mobile-widget__item'>
                    <span className='mobile-widget__item-label'>{localize('Multiplier')}</span>
                    <span className='mobile-widget__item-value'>x{multiplier}</span>
                </div>
            </div>
        </React.Fragment>
    );
};

export const MultiplierAmountWidget = connect(({ modules }) => ({
    amount: modules.trade.amount,
    currency: modules.trade.currency,
    multiplier: modules.trade.multiplier,
}))(AmountWidget);

const CommissionWidget = ({ commission, multiplier, amount, currency, addToast }) => {
    const commission_percentage = Number((commission * 100) / (multiplier * amount)).toFixed(4);

    const showCommissionToast = () => {
        const text = (
            <Localize
                i18n_default_text='<0>{{commission_percentage}}%</0> of (<1/> * {{multiplier}})'
                values={{ commission_percentage, multiplier }}
                components={[<span className='bold' key={0} />, <Money key={1} amount={amount} currency={currency} />]}
            />
        );

        addToast({
            key: 'multiplier_commission',
            content: text,
            type: 'info',
        });
    };

    return (
        <div className='mobile-widget__multiplier-commission' onClick={showCommissionToast}>
            <Localize
                i18n_default_text='Commission: <0/>'
                components={[<Money key={0} amount={commission} currency={currency} />]}
            />
            <Icon icon='IcInfoOutline' />
        </div>
    );
};

export const MultiplierCommissionWidget = connect(({ modules, ui }) => ({
    amount: modules.trade.amount,
    currency: modules.trade.currency,
    multiplier: modules.trade.multiplier,
    commission: modules.trade.commission,
    addToast: ui.addToast,
}))(CommissionWidget);
