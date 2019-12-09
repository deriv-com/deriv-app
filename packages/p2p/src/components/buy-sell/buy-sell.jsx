import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import {
    Dialog,
    ButtonToggle }          from 'deriv-components';
import { localize }         from 'deriv-translations';
import { BuySellTable }     from './buy-sell-table.jsx';
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
        filter_value: 'buy',
        selected_ad : {},
        show_popup  : false,
    }

    componentDidMount() {
        // Call API to retrieve buy_sell ad list
        this.setState({ is_loading: false });
    }

    setSelectedAd = selected_ad => {
        this.setState({ selected_ad, show_popup: true });
    }

    onCancelClick = () => {
        this.setState({ show_popup: false });
    }

    onFilterChange = (event) => {
        this.setState({ filter_value: event.target.value });
    }

    render() {
        const { show_popup, filter_value, selected_ad } = this.state;

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
                {/* <BuySellTable
                    setSelectedAd={this.setSelectedAd}
                    table={filter_value}
                /> */}
            </div>
        );
    }
}

BuySell.propTypes = {
    disableApp: PropTypes.func,
};
 
export default BuySell;
