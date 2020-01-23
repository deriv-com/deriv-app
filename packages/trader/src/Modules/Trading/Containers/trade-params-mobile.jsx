/* eslint-disable default-case */
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { Tabs, TickPicker, Numpad }   from '@deriv/components';
import { localize }                   from '@deriv/translations';
import { convertDurationLimit }       from 'Stores/Modules/Trading/Helpers/duration';
// import Amount                         from 'Modules/Trading/Components/Form/TradeParams/amount.jsx';
// import Barrier                        from 'Modules/Trading/Components/Form/TradeParams/barrier.jsx';
// import Duration                       from 'Modules/Trading/Components/Form/TradeParams/Duration';
// import LastDigit                      from 'Modules/Trading/Components/Form/TradeParams/last-digit.jsx';
import { connect }                    from 'Stores/connect';
import                                     'Sass/app/modules/trading-mobile.scss';


// TODO: check that duration ** will not be greater / smaller than min max **
const setDefaultTicksValue = (duration, selected_duration) => {
    const DEFAULT_TICK = 5;
    return selected_duration === 't' ? duration : DEFAULT_TICK;
};
const setDefaultSecondValue = (duration, selected_duration) => {
    const DEFAULT_SECOND = 15;
    return selected_duration === 's' ? duration : DEFAULT_SECOND;
};
const setDefaultMinuteValue = (duration, selected_duration) => {
    const DEFAULT_MINUTE = 3;
    return selected_duration === 'm' ? duration : DEFAULT_MINUTE;
}
const setDefaultHourValue = (duration, selected_duration) => {
    const DEFAULT_HOUR = 1;
    return selected_duration === 'h' ? duration : DEFAULT_HOUR;
}
const setDefaultDayValue = (duration, selected_duration) => {
    const DEFAULT_DAY = 1;
    return selected_duration === 'd' ? duration : DEFAULT_DAY;
}

// TODO: move to Stores/Modules/Trading/Helpers/duration
const getDurationMinMaxValues = (duration_min_max, contract_expiry_type, duration_unit) => {
    if (!duration_min_max[contract_expiry_type]) return [];
    const max_value = convertDurationLimit(+duration_min_max[contract_expiry_type].max, duration_unit);
    const min_value = convertDurationLimit(+duration_min_max[contract_expiry_type].min, duration_unit);

    return [min_value, max_value];
};

const Duration = ({ onChangeMultiple, contract_expiry_type, duration_units_list, duration, duration_unit, duration_tab_idx, setDurationTabIdx, duration_min_max }) => {
    const consoleOut = (value) => {
        // eslint-disable-next-line
        console.log(value);
        const { value: duration_value } = value.target;
        console.log('select: ', duration_value);

        onChangeMultiple({
            duration_unit: 't',
            duration     : duration_value,
         });

        //  TODO: close modal after duration has been set
    };

    // TODO: set default value for active selection -- with duration_unit
    console.log('duration: ', duration);
    console.log('duration_unit: ', duration_unit);
    console.log('duration_min_max: ', duration_min_max);
    console.log('contract_expiry_type: ', contract_expiry_type);
    // Get min max for duration
    const active_index = typeof duration_tab_idx === 'undefined' ?
        duration_units_list.findIndex(d => d.value === duration_unit) : duration_tab_idx;

    return (
        <div>
            <Tabs active_index={active_index} onTabItemClick={setDurationTabIdx} top>
                {
                    duration_units_list.map((duration_unit_option) => {
                        switch (duration_unit_option.value) {
                            case 't':
                                const [min_tick, max_tick] = getDurationMinMaxValues(duration_min_max, 'tick', 't');

                                return (
                                    <div label={'Ticks'} key={duration_unit_option.value}>
                                        <div className='trade-params__duration-tickpicker'>
                                            <TickPicker
                                                default_value={setDefaultTicksValue(duration, duration_unit)}
                                                submit_label='OK'
                                                max_value={max_tick}
                                                min_value={min_tick}
                                                onSubmit={consoleOut}
                                                singular_label='Tick'
                                                plural_label='Ticks'
                                            />
                                        </div>
                                    </div>
                                );
                            case 's':
                                const [min_sec, max_sec] = getDurationMinMaxValues(duration_min_max, 'intraday', 's');

                                return (
                                    <div label={'Seconds'} key={duration_unit_option.value}>
                                        <div className='trade-params__amount-keypad'>
                                            {/* TODO: Move to amount component and pass props accordingly */}
                                            <Numpad
                                                value={setDefaultSecondValue(duration, duration_unit)}
                                                onSubmit={consoleOut}
                                                is_currency
                                                render={({ value: v, className }) => {
                                                    return (
                                                        <div className={className}>{v}</div>
                                                    );
                                                }}
                                                pip_size={2}
                                                submit_label={'OK'}
                                                min={min_sec}
                                                max={max_sec}
                                            />
                                        </div>
                                    </div>
                                );
                            case 'm':
                                const [min_m, max_m] = getDurationMinMaxValues(duration_min_max, 'intraday', 'm');

                                return (
                                    <div label={'Minutes'} key={duration_unit_option.value}>
                                        <div className='trade-params__amount-keypad'>
                                            {/* TODO: Move to amount component and pass props accordingly */}
                                            <Numpad
                                                value={setDefaultMinuteValue(duration, duration_unit)}
                                                onSubmit={consoleOut}
                                                is_currency
                                                render={({ value: v, className }) => {
                                                    return (
                                                        <div className={className}>{v}</div>
                                                    );
                                                }}
                                                pip_size={2}
                                                submit_label={'OK'}
                                                min={min_m}
                                                max={max_m}
                                            />
                                        </div>
                                    </div>
                                );
                            case 'h':
                                const [min_h, max_h] = getDurationMinMaxValues(duration_min_max, 'intraday', 'h');

                                return (
                                    <div label={'Hours'} key={duration_unit_option.value}>
                                        <div className='trade-params__amount-keypad'>
                                            {/* TODO: Move to amount component and pass props accordingly */}
                                            <Numpad
                                                value={setDefaultHourValue(duration, duration_unit)}
                                                onSubmit={consoleOut}
                                                is_currency
                                                render={({ value: v, className }) => {
                                                    return (
                                                        <div className={className}>{v}</div>
                                                    );
                                                }}
                                                pip_size={2}
                                                submit_label={'OK'}
                                                min={min_h}
                                                max={max_h}
                                            />
                                        </div>
                                    </div>
                                );
                            case 'd':
                                const [min_d, max_d] = getDurationMinMaxValues(duration_min_max, 'daily', 'h');

                                return (
                                    <div label={'Days'} key={duration_unit_option.value}>
                                        <div className='trade-params__amount-keypad'>
                                            {/* TODO: Move to amount component and pass props accordingly */}
                                            <Numpad
                                                value={setDefaultDayValue(duration, duration_unit)}
                                                onSubmit={consoleOut}
                                                is_currency
                                                render={({ value: v, className }) => {
                                                    return (
                                                        <div className={className}>{v}</div>
                                                    );
                                                }}
                                                pip_size={2}
                                                submit_label={'OK'}
                                                min={min_d}
                                                max={max_d}
                                            />
                                        </div>
                                    </div>
                                );
                        }
                        return null;
                    })
                }
            </Tabs>
        </div>
    );
};

class TradeParamsMobile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active_tab_index: 0,
            duration_tab_idx: undefined,
        };
    }

    updateTabIndex = (index) => {
        this.setState({
            active_tab_index: index,
        });
    }

    setDurationTabIdx = duration_tab_idx => this.setState({ duration_tab_idx })

    consoleOut = (value) => {
        // eslint-disable-next-line
        console.warn(value);
    }

    isVisible(component_key) {
        return this.props.form_components.includes(component_key);
    }

    componentDidMount() {
        console.log(this.props.form_components);
        console.log(this.props.duration_units_list);
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
                    <Duration
                        onChangeMultiple={this.props.onChangeMultiple}
                        contract_expiry_type={this.props.contract_expiry_type}
                        duration_tab_idx={this.state.duration_tab_idx}
                        setDurationTabIdx={this.setDurationTabIdx}
                        duration={this.props.duration}
                        duration_unit={this.props.duration_unit}
                        duration_units_list={this.props.duration_units_list}
                        duration_min_max={this.props.duration_min_max}
                    />
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
    // TODO: connect directly with <Duration />
    duration_units_list   : modules.trade.duration_units_list,
    duration     : modules.trade.duration,
    duration_unit         : modules.trade.duration_unit,
    duration_min_max      : modules.trade.duration_min_max,
    contract_expiry_type  : modules.trade.contract_expiry_type,
    onChangeMultiple      : modules.trade.onChangeMultiple,
}))(TradeParamsMobile);
