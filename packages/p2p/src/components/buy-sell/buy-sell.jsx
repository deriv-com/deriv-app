import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { Dialog }           from 'deriv-components';
import { BuySellTable }     from './buy-sell-table.jsx';
import Popup                from './popup.jsx';
import                           './buy-sell.scss';

/* TODO [p2p-uncomment] uncomment this when sell is ready */
// const buy_sell_filters = [
//     {
//         text : localize('Buy'),
//         value: 'buy',
//     },
//     {
//         text : localize('Sell'),
//         value: 'sell',
//     },
// ];

class BuySell extends Component {
    state = {
        table_type : 'buy',
        selected_ad: {},
        show_popup : false,
    }

    setSelectedAd = selected_ad => {
        this.setState({ selected_ad, show_popup: true });
    }

    onCancelClick = () => {
        this.setState({ show_popup: false });
    }

    onChangeTableType = (event) => {
        this.setState({ table_type: event.target.value });
    }

    onConfirmClick = (order_info) => {
        this.props.navigate('orders', { order_info });
    }

    render() {
        const { table_type, selected_ad, show_popup } = this.state;

        return (
            <div className='buy-sell'>
                {/* TODO [p2p-uncomment] uncomment this when sell is ready */}
                {/* <div className='buy-sell__header'> */}
                {/*    <ButtonToggle */}
                {/*        buttons_arr={buy_sell_filters} */}
                {/*        className='buy-sell__header__filters' */}
                {/*        is_animated */}
                {/*        name='filter' */}
                {/*        onChange={this.onChangeTableType} */}
                {/*        value={table_type} */}
                {/*    /> */}
                {/* </div> */}
                <BuySellTable
                    table_type={table_type}
                    setSelectedAd={this.setSelectedAd}
                    // TODO: pass currency here
                    exchange_to_currency={'BTC'}
                    // TODO: get from API
                    exchange_amount={'1'}
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
    params  : PropTypes.object,
};

export default BuySell;
