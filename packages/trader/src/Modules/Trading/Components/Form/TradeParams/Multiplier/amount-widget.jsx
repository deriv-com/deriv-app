import React from 'react';
import { Money } from '@deriv/components';
import { connect } from 'Stores/connect';
import { Localize } from '@deriv/translations';
import MultiplierAmountModal from 'Modules/Trading/Containers/Multiplier/multiplier-amount-modal.jsx';
import MultiplierOptionsModal from 'Modules/Trading/Containers/Multiplier/multiplier-options-modal.jsx';

const AmountWidget = ({ amount, currency }) => {
    const [is_open, setIsOpen] = React.useState(false);

    const toggleModal = () => {
        setIsOpen(!is_open);
    };

    return (
        <React.Fragment>
            <MultiplierAmountModal is_open={is_open} toggleModal={toggleModal} />
            <div className='mobile-widget mobile-widget__multiplier-amount' onClick={toggleModal}>
                <div className='mobile-widget__item'>
                    <span className='mobile-widget__item-value'>
                        <Money amount={amount} currency={currency} show_currency />
                    </span>
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

const MultiplierWidget = ({ commission, currency, multiplier }) => {
    const [is_open, setIsOpen] = React.useState(false);

    const toggleModal = () => {
        setIsOpen(!is_open);
    };

    return (
        <React.Fragment>
            <MultiplierOptionsModal is_open={is_open} toggleModal={toggleModal} />
            <div className='mobile-widget mobile-widget__multiplier-options' onClick={toggleModal}>
                <div className='mobile-widget__item'>
                    <span className='mobile-widget__item-value'>x{multiplier}</span>
                </div>
                <div className='mobile-widget__item'>
                    <span className='mobile-widget__item-label'>
                        <Localize
                            i18n_default_text='Commission: <0/>'
                            components={[<Money key={0} amount={commission} currency={currency} />]}
                        />
                    </span>
                </div>
            </div>
        </React.Fragment>
    );
};

export const MultiplierOptionsWidget = connect(({ modules, ui }) => ({
    currency: modules.trade.currency,
    multiplier: modules.trade.multiplier,
    commission: modules.trade.commission,
    addToast: ui.addToast,
}))(MultiplierWidget);
