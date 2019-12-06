import React, { Component } from 'react';
import { ButtonToggle }     from 'deriv-components';
import { localize }         from 'deriv-translations';
// import { WS } from '../../utils/websocket';
import './ads.scss';

const ads_filters = [
    {
        text : localize('Buy'),
        value: 'buy',
    },
    {
        text : localize('Sell'),
        value: 'sell',
    },
];

class Ads extends Component {
    state = {
        ads_list    : [],
        filter_value: 'buy',
    }

    onChange = (event) => {
        this.setState({
            filter_value: event.target.value,
        });
    }

    render() {
        const { filter_value } = this.state;
        return (
            <div className='ads'>
                <div className='ads__header'>
                    <ButtonToggle
                        buttons_arr={ads_filters}
                        className='ads__header__filters'
                        is_animated
                        name='filter'
                        onChange={this.onChange}
                        value={filter_value}
                    />
                </div>
            </div>
        );
    }
}

export default Ads;
