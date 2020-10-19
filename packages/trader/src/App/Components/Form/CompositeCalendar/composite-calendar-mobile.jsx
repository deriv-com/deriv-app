import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, MobileDialog, Button, DatePicker } from '@deriv/components';
import { localize } from '@deriv/translations';
import InputField from 'App/Components/Form/InputField/input-field.jsx';
import { toMoment } from '@deriv/shared';

export const RadioButton = ({ id, className, selected_value, value, label, onChange }) => {
    return (
        <label
            htmlFor={id}
            className={classNames('composite-calendar-modal__radio', className, {
                'composite-calendar-modal__radio--selected': selected_value === value,
            })}
            onClick={() => onChange({ label, value })}
        >
            <input className='composite-calendar-modal__radio-input' id={id} type='radio' value={value} />
            <span
                className={classNames('composite-calendar-modal__radio-circle', {
                    'composite-calendar-modal__radio-circle--selected': selected_value === value,
                })}
            />
            <p className='composite-calendar-modal__radio-label'>{label}</p>
        </label>
    );
};
const CUSTOM_KEY = 'custom';

class CompositeCalendarMobile extends React.PureComponent {
    constructor(props) {
        super(props);
        const { duration_list, input_date_range, from, to } = this.props;
        const from_date = from && toMoment(from).format('DD MMM YYYY');
        const to_date = from && toMoment(to).format('DD MMM YYYY');

        const date_range = input_date_range || duration_list.find(range => range.value === 'all_time');
        this.state = {
            from: from_date,
            to: to_date,
            applied_date_range: date_range,
            selected_date_range: date_range,
        };
    }

    selectDateRange(selected_date_range, is_today) {
        const from = selected_date_range.duration;
        this.props.onChange(
            {
                from: is_today || from ? toMoment().startOf('day').subtract(from, 'day').add(1, 's').unix() : null,
                to: toMoment().endOf('day').unix(),
                is_batch: true,
            },
            {
                date_range: selected_date_range,
            }
        );
    }

    selectCustomDateRange() {
        const { selected_date_range } = this.state;
        const today = toMoment().format('DD MMM YYYY');
        let { from, to } = this.state;

        from = from || to || today;
        to = to || today;

        const date_range = Object.assign(selected_date_range, {
            label: `${from} - ${to}`,
        });

        this.props.onChange(
            {
                from: toMoment(from, 'DD MMM YYYY').startOf('day').add(1, 's').unix(),
                to: toMoment(to, 'DD MMM YYYY').endOf('day').unix(),
                is_batch: true,
            },
            {
                date_range,
            }
        );
    }

    applyDateRange = () => {
        const { selected_date_range: date_range } = this.state;

        if (date_range.onClick) {
            this.selectDateRange(date_range);
        } else if (date_range.value === CUSTOM_KEY) {
            this.selectCustomDateRange();
        }
        this.setState({
            applied_date_range: date_range,
            open: false,
        });
    };

    selectToday = () => {
        const date_range = {
            duration: 0,
            label: localize('Today'),
        };
        this.selectDateRange(date_range, true);
        this.setState({
            applied_date_range: date_range,
            selected_date_range: date_range,
            open: false,
        });
    };

    selectDate = (e, key) => {
        this.setState({
            selected_date_range: { value: CUSTOM_KEY },
            [key]: e.target?.value ? toMoment(e.target.value).format('DD MMM YYYY') : '',
        });
    };

    getMobileFooter() {
        return (
            <div className='composite-calendar-modal__actions'>
                <Button
                    className='composite-calendar-modal__actions__cancel'
                    text={localize('Cancel')}
                    onClick={() => this.setState({ open: false })}
                    has_effect
                    secondary
                    large
                />
                <Button
                    className='composite-calendar-modal__actions__ok'
                    text={localize('OK')}
                    onClick={this.applyDateRange}
                    has_effect
                    primary
                    large
                />
            </div>
        );
    }

    onDateRangeChange = date_range => {
        const { duration_list } = this.props;
        const selected_date_range =
            duration_list.find(range => date_range && range.value === date_range.value) || date_range;
        this.setState({ selected_date_range });
    };

    openDialog = () => {
        const { applied_date_range } = this.state;
        this.setState({ open: true, selected_date_range: applied_date_range });
    };

    render() {
        const { open, applied_date_range, selected_date_range } = this.state;
        const { duration_list } = this.props;

        const today = toMoment().format('YYYY-MM-DD');
        const max_date = this.state.to ? toMoment(this.state.to, 'DD MMM YYYY').format('YYYY-MM-DD') : today;
        const min_date = this.state.from && toMoment(this.state.from, 'DD MMM YYYY').format('YYYY-MM-DD');

        return (
            <>
                <div className='composite-calendar__input-fields composite-calendar__input-fields--fill'>
                    <InputField
                        id='dt_calendar_input'
                        is_read_only={true}
                        icon={() => <Icon icon='IcCalendarDatefrom' className='inline-icon' />}
                        onClick={this.openDialog}
                        value={applied_date_range.label}
                    />
                </div>
                <MobileDialog
                    portal_element_id='modal_root'
                    title={localize('Please select duration')}
                    visible={open}
                    has_content_scroll
                    onClose={() => this.setState({ open: false })}
                    content_height_offset='94px'
                    footer={this.getMobileFooter()}
                >
                    <div className='composite-calendar-modal'>
                        <div className='composite-calendar-modal__radio-group'>
                            {duration_list.map(duration => (
                                <RadioButton
                                    id={`composite-calendar-modal__radio__${duration.value}`}
                                    key={duration.value}
                                    value={duration.value}
                                    label={duration.label}
                                    selected_value={selected_date_range.value}
                                    onChange={this.onDateRangeChange}
                                />
                            ))}
                        </div>
                        <div className='composite-calendar-modal__custom'>
                            <RadioButton
                                id={'composite-calendar-modal__custom-radio'}
                                className='composite-calendar-modal__custom-radio'
                                value={CUSTOM_KEY}
                                label={localize('Custom')}
                                selected_value={selected_date_range.value}
                                onChange={this.onDateRangeChange}
                            />
                            <div className='composite-calendar-modal__custom-date-range'>
                                <DatePicker
                                    className='composite-calendar-modal__custom-date-range-start-date'
                                    is_nativepicker={true}
                                    placeholder={localize('Start date')}
                                    value={this.state.from}
                                    max_date={max_date}
                                    onChange={e => this.selectDate(e, 'from')}
                                />
                                <DatePicker
                                    className='composite-calendar-modal__custom-date-range-end-date'
                                    is_nativepicker={true}
                                    placeholder={localize('End date')}
                                    value={this.state.to}
                                    max_date={today}
                                    min_date={min_date}
                                    onChange={e => this.selectDate(e, 'to')}
                                />
                            </div>
                        </div>
                        <Button
                            className='composite-calendar-modal__actions-today'
                            text={localize('Back to today')}
                            onClick={this.selectToday}
                            has_effect
                            tertiary
                            large
                        />
                    </div>
                </MobileDialog>
            </>
        );
    }
}

CompositeCalendarMobile.propTypes = {
    duration_list: PropTypes.array,
    from: PropTypes.number,
    onChange: PropTypes.func,
    to: PropTypes.number,
};
export default CompositeCalendarMobile;
