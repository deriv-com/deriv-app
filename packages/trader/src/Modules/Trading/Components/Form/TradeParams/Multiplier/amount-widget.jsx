import React from 'react';
import { Money } from '@deriv/components';
import { connect } from 'Stores/connect';
import { localize } from '@deriv/translations';
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

export default connect(({ modules }) => ({
    amount: modules.trade.amount,
    currency: modules.trade.currency,
    multiplier: modules.trade.multiplier,
}))(AmountWidget);
