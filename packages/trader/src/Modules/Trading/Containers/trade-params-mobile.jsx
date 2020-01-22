import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { Tabs, TickPicker, Numpad }   from '@deriv/components';
import { localize }                   from '@deriv/translations';
// import Amount                         from 'Modules/Trading/Components/Form/TradeParams/amount.jsx';
// import Barrier                        from 'Modules/Trading/Components/Form/TradeParams/barrier.jsx';
// import Duration                       from 'Modules/Trading/Components/Form/TradeParams/Duration';
// import LastDigit                      from 'Modules/Trading/Components/Form/TradeParams/last-digit.jsx';
import { connect }                    from 'Stores/connect';
import                                     'Sass/app/modules/trading-mobile.scss';

class TradeParamsMobile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active_tab_index: 0,
        };
    }

    updateTabIndex = (index) => {
        this.setState({
            active_tab_index: index,
        });
    }

    consoleOut = (value) => {
        // eslint-disable-next-line
        console.warn(value);
    }

    isVisible(component_key) {
        return this.props.form_components.includes(component_key);
    }

    render () {
        // const { is_minimized } = this.props;
        return (
            <Tabs
                active_index={this.state.active_tab_index}
                className='trade-params-duration-amount'
                onTabItemClick={this.updateTabIndex}
                top
            >
                <div label={localize('Duration')}>
                    {/* TODO: Move to duration component (switch between this and keypad) and pass props accordingly */}
                    <div className='trade-params__duration-tickpicker'>
                        <TickPicker
                            submit_label='OK'
                            max_value='7'
                            min_value='2'
                            onSubmit={this.consoleOut}
                            singular_label='Tick'
                            plural_label='Ticks'
                        />
                    </div>
                </div>
                <div label={localize('Amount')}>
                    <div className='trade-params__amount-keypad'>
                        {/* TODO: Move to amount component and pass props accordingly */}
                        <Numpad
                            value={0}
                            onSubmit={this.consoleOut}
                            is_currency
                            render={({ value: v, className }) => {
                                return (
                                    <div className={className}>{v}</div>
                                );
                            }}
                            pip_size={2}
                            submit_label={'OK'}
                            min={1}
                            max={1500}
                        />
                    </div>
                </div>
            </Tabs>
        );
    }
}
TradeParamsMobile.propTypes = {
    form_components: MobxPropTypes.arrayOrObservableArray,
    is_minimized   : PropTypes.bool,
};

export default connect(({ modules }) => ({
    form_components: modules.trade.form_components,
}))(TradeParamsMobile);
