import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, ButtonToggle } from '@deriv/components';
import { localize } from 'Components/i18next';
import Popup from './popup.jsx';
import './buy-sell.scss';
import BuySellTableContent from './buy-sell-table-content.jsx';

const buy_sell_filters = [
    {
        text: localize('Buy'),
        value: 'buy',
    },
    {
        text: localize('Sell'),
        value: 'sell',
    },
];

class BuySell extends React.Component {
    state = {
        table_type: 'buy',
        selected_ad: {},
        show_popup: false,
    };

    setSelectedAd = selected_ad => {
        this.setState({ selected_ad, show_popup: true });
    };

    onCancelClick = () => {
        this.setState({ show_popup: false });
    };

    onChangeTableType = event => {
        this.setState({ table_type: event.target.value });
    };

    onConfirmClick = order_info => {
        const nav = { location: 'buy_sell' };
        this.props.navigate('orders', { order_info, nav });
    };

    render() {
        const { table_type, selected_ad, show_popup } = this.state;

        return (
            <div className='buy-sell'>
                <div className='buy-sell__header'>
                    <ButtonToggle
                        buttons_arr={buy_sell_filters}
                        className='buy-sell__header__filters'
                        is_animated
                        name='filter'
                        onChange={this.onChangeTableType}
                        value={table_type}
                        has_rounded_button
                    />
                </div>
                <BuySellTableContent
                    key={table_type}
                    is_buy={table_type === 'buy'}
                    setSelectedAd={this.setSelectedAd}
                />
                {show_popup && (
                    <div className='buy-sell__dialog'>
                        <Dialog is_visible={show_popup}>
                            <Popup
                                ad={selected_ad}
                                handleClose={this.onCancelClick}
                                handleConfirm={this.onConfirmClick}
                            />
                        </Dialog>
                    </div>
                )}
            </div>
        );
    }
}

BuySell.propTypes = {
    navigate: PropTypes.func,
    params: PropTypes.object,
};

export default BuySell;
