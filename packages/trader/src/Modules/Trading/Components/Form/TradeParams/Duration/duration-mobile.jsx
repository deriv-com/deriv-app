import React from 'react';
import { Tabs, TickPicker, Numpad, RelativeDatepicker } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { getDurationMinMaxValues } from 'Stores/Modules/Trading/Helpers/duration';

const submit_label = localize('OK');

const Ticks = ({ toggleModal, onChangeMultiple, duration_min_max, selected_duration, setSelectedDuration }) => {
    const [min_tick, max_tick] = getDurationMinMaxValues(duration_min_max, 'tick', 't');

    const setTickDuration = value => {
        const { value: duration } = value.target;
        onChangeMultiple({ duration_unit: 't', duration });
        toggleModal();
    };

    const onTickChange = tick => setSelectedDuration('t', tick);

    return (
        <div className='trade-params__duration-tickpicker'>
            <TickPicker
                default_value={selected_duration}
                submit_label={submit_label}
                max_value={max_tick}
                min_value={min_tick}
                onSubmit={setTickDuration}
                onValueChange={onTickChange}
                singular_label={localize('Tick')}
                plural_label={localize('Ticks')}
            />
        </div>
    );
};

const TicksWrapper = connect(({ modules }) => ({
    duration_min_max: modules.trade.duration_min_max,
    onChangeMultiple: modules.trade.onChangeMultiple,
}))(Ticks);

const Numbers = ({
    toggleModal,
    onChangeMultiple,
    duration_min_max,
    duration_unit_option,
    contract_expiry = 'intraday',
    selected_duration,
    setSelectedDuration,
    calendar_date,
}) => {
    const { value: duration_unit } = duration_unit_option;
    const [min, max] = getDurationMinMaxValues(duration_min_max, contract_expiry, duration_unit);

    const setDuration = duration => {
        onChangeMultiple({ duration_unit, duration });
        toggleModal();
    };

    const onNumberChange = num => setSelectedDuration(duration_unit, num);

    return (
        <div className='trade-params__amount-keypad'>
            <Numpad
                value={selected_duration}
                onSubmit={setDuration}
                render={({ value: v, className }) => {
                    return <div className={className}>{v}</div>;
                }}
                pip_size={0}
                submit_label={submit_label}
                min={min}
                max={max}
                onValueChange={onNumberChange}
                calendar_date={calendar_date}
            />
        </div>
    );
};

const NumpadWrapper = connect(({ modules }) => ({
    duration_min_max: modules.trade.duration_min_max,
    onChangeMultiple: modules.trade.onChangeMultiple,
}))(Numbers);

class Duration extends React.Component {
    state = {
        calendar_date: this.props.d_duration,
    };
    render() {
        const {
            toggleModal,
            duration_units_list,
            duration_unit,
            duration_tab_idx,
            duration_min_max,
            setDurationTabIdx,
            t_duration,
            s_duration,
            m_duration,
            h_duration,
            d_duration,
            setSelectedDuration,
        } = this.props;

        const has_selected_tab_idx = typeof duration_tab_idx !== 'undefined';
        const active_index = has_selected_tab_idx
            ? duration_tab_idx
            : duration_units_list.findIndex(d => d.value === duration_unit);
        const [min, max] = getDurationMinMaxValues(duration_min_max, 'daily', 'd');
        const handleRelativeChange = date => {
            this.setState({
                calendar_date: date,
            });
        };
        return (
            <div>
                <Tabs active_index={active_index} onTabItemClick={num => setDurationTabIdx(num)} top>
                    {duration_units_list.map(duration_unit_option => {
                        switch (duration_unit_option.value) {
                            case 't':
                                return (
                                    <div label={duration_unit_option.text} key={duration_unit_option.value}>
                                        <TicksWrapper
                                            toggleModal={toggleModal}
                                            selected_duration={t_duration}
                                            setSelectedDuration={setSelectedDuration}
                                        />
                                    </div>
                                );
                            case 's':
                                return (
                                    <div label={duration_unit_option.text} key={duration_unit_option.value}>
                                        <NumpadWrapper
                                            toggleModal={toggleModal}
                                            duration_unit_option={duration_unit_option}
                                            selected_duration={s_duration}
                                            setSelectedDuration={setSelectedDuration}
                                        />
                                    </div>
                                );
                            case 'm':
                                return (
                                    <div label={duration_unit_option.text} key={duration_unit_option.value}>
                                        <NumpadWrapper
                                            toggleModal={toggleModal}
                                            duration_unit_option={duration_unit_option}
                                            selected_duration={m_duration}
                                            setSelectedDuration={setSelectedDuration}
                                        />
                                    </div>
                                );
                            case 'h':
                                return (
                                    <div label={duration_unit_option.text} key={duration_unit_option.value}>
                                        <NumpadWrapper
                                            toggleModal={toggleModal}
                                            duration_unit_option={duration_unit_option}
                                            selected_duration={h_duration}
                                            setSelectedDuration={setSelectedDuration}
                                        />
                                    </div>
                                );
                            case 'd':
                                return (
                                    <div label={duration_unit_option.text} key={duration_unit_option.value}>
                                        <NumpadWrapper
                                            toggleModal={toggleModal}
                                            duration_unit_option={duration_unit_option}
                                            contract_expiry='daily'
                                            selected_duration={d_duration}
                                            setSelectedDuration={setSelectedDuration}
                                            calendar_date={this.state.calendar_date}
                                        />
                                        <RelativeDatepicker onChange={handleRelativeChange} min={min} max={max} />
                                    </div>
                                );
                            default:
                                return null;
                        }
                    })}
                </Tabs>
            </div>
        );
    }
}

export default connect(({ modules }) => ({
    duration_units_list: modules.trade.duration_units_list,
    duration_unit: modules.trade.duration_unit,
    duration_min_max: modules.trade.duration_min_max,
}))(Duration);
