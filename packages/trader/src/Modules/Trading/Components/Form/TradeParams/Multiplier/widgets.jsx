import React from 'react';
import { Money, Text } from '@deriv/components';
import { connect } from 'Stores/connect';
import MultiplierAmountModal from 'Modules/Trading/Containers/Multiplier/multiplier-amount-modal.jsx';
import MultiplierOptionsModal from 'Modules/Trading/Containers/Multiplier/multiplier-options-modal.jsx';
import MultipliersInfo from 'Modules/Trading/Components/Form/TradeParams/Multiplier/info.jsx';

const AmountWidget = ({ amount, currency }) => {
    const [is_open, setIsOpen] = React.useState(false);

    const toggleModal = () => {
        setIsOpen(!is_open);
    };

    return (
        <React.Fragment>
            <MultiplierAmountModal is_open={is_open} toggleModal={toggleModal} />
            <div className='mobile-widget' onClick={toggleModal}>
                <div className='mobile-widget__multiplier-amount'>
                    <div className='mobile-widget__item'>
                        <Text weight='bold' size='xxs'>
                            <Money amount={amount} currency={currency} show_currency />
                        </Text>
                    </div>
                </div>
                <MultipliersInfo className='mobile-widget__multiplier-trade-info' />
            </div>
        </React.Fragment>
    );
};

export const MultiplierAmountWidget = connect(({ modules }) => ({
    amount: modules.trade.amount,
    currency: modules.trade.currency,
    multiplier: modules.trade.multiplier,
}))(AmountWidget);

const MultiplierWidget = ({ multiplier }) => {
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
            </div>
        </React.Fragment>
    );
};

export const MultiplierOptionsWidget = connect(({ modules, ui }) => ({
    multiplier: modules.trade.multiplier,
    addToast: ui.addToast,
}))(MultiplierWidget);
