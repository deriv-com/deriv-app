import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import {
    Button,
    Dialog,
    Loading,
    ButtonToggle }          from 'deriv-components';
import { localize }         from '../i18next';
import Popup                from './popup.jsx';
import                           './buy-sell.scss';

const buy_sell_filters = [
    {
        text : localize('Buy'),
        value: 'buy',
    },
    {
        text : localize('Sell'),
        value: 'sell',
    },
];

class BuySell extends Component {
    state = {
        buy_sell_list: [],
        is_loading   : true,
        selected_ad  : {},
        show_popup   : false,
        filter_value : 'buy',
    }

    componentDidMount() {
        // Call API to retrieve buy_sell ad list
        this.setState({
            buy_sell_list: [
                ...this.state.buy_sell_list,
                {
                    id             : 'buy_id',
                    advertiser     : 'John doe',
                    country        : 'Indonesia',
                    currency       : 'IDR',
                    type           : 'buy',
                    asset          : 'USD',
                    fix_price      : 12000,
                    amount         : 20,
                    min_transaction: 15000,
                    max_transaction: 240000,
                    payment_method : 'Bank transfer',
                    advertiser_note: 'Whatsapp: +60182655318 please send to Maybank 239847238947 JOHN DOE',
                },
                {
                    id             : 'sell_id',
                    advertiser     : 'John doe',
                    country        : 'Indonesia',
                    currency       : 'IDR',
                    type           : 'sell',
                    asset          : 'USD',
                    fix_price      : 12000,
                    amount         : 20,
                    min_transaction: 15000,
                    max_transaction: 240000,
                    payment_method : 'Bank transfer',
                    advertiser_note: 'please contact through Whatsapp: +60182655318',
                },
            ],
            is_loading: false,
        });
    }

    handleClick = (ad) => {
        this.setState({ selected_ad: ad, show_popup: true });
    }

    onCancelClick = () => {
        this.setState({ show_popup: false });
    }

    onFilterChange = (event) => {
        this.setState({
            filter_value: event.target.value,
        });
    }

    render() {
        const { buy_sell_list, show_popup, filter_value, is_loading, selected_ad } = this.state;
        return (
            <div className='buy-sell'>
                <div className='buy-sell__header'>
                    <ButtonToggle
                        buttons_arr={buy_sell_filters}
                        className='buy-sell__header__filters'
                        is_animated
                        name='filter'
                        onChange={this.onFilterChange}
                        value={filter_value}
                    />
                </div>
                {is_loading ? <Loading is_fullscreen={false} /> : (
                    <ul className='buy-sell__list-wrapper'>
                        {buy_sell_list.map(ad => (
                            <li key={ad.id} className='buy-sell__list'>
                                <Button primary onClick={() => this.handleClick(ad)}>
                                    {ad.type}
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
                {show_popup && (
                    <div className='buy-sell__dialog'>
                        <Dialog
                            is_visible={show_popup}
                            disableApp={() => {
                                /* do nothing // disableApp is a mandatory props in dialog */
                            }}
                            enableApp={() => {
                                /* do nothing // enableApp is a mandatory props in dialog */
                            }}
                        >
                            <Popup ad={selected_ad} onCancel={this.onCancelClick} />
                        </Dialog>
                    </div>
                )}
            </div>
        );
    }
}

BuySell.propTypes = {
    disableApp: PropTypes.func,
};
 
export default BuySell;
