import React from 'react';
import classNames from 'classnames';
import { Dropdown, Icon, Text } from '@deriv/components';
import { Localize, localize } from 'Components/i18next';
import SeparatorContainerLine from 'Components/separator-container-line';
import './business-hour-modal-edit.scss';

const hours_list = [
    { text: '12:00 am', value: '12:00 am' },
    { text: '12:30 am', value: '12:30 am' },
    { text: '01:00 am', value: '01:00 am' },
    { text: '01:30 am', value: '01:30 am' },
    { text: '02:00 am', value: '02:00 am' },
    { text: '02:30 am', value: '02:30 am' },
    { text: '03:00 am', value: '03:00 am' },
    { text: '03:30 am', value: '03:30 am' },
    { text: '04:00 am', value: '04:00 am' },
    { text: '04:30 am', value: '04:30 am' },
    { text: '05:00 am', value: '05:00 am' },
    { text: '05:30 am', value: '05:30 am' },
    { text: '06:00 am', value: '06:00 am' },
    { text: '06:30 am', value: '06:30 am' },
    { text: '07:00 am', value: '07:00 am' },
    { text: '07:30 am', value: '07:30 am' },
    { text: '08:00 am', value: '08:00 am' },
    { text: '08:30 am', value: '08:30 am' },
    { text: '09:00 am', value: '09:00 am' },
    { text: '09:30 am', value: '09:30 am' },
    { text: '10:00 am', value: '10:00 am' },
    { text: '10:30 am', value: '10:30 am' },
    { text: '11:00 am', value: '11:00 am' },
    { text: '11:30 am', value: '11:30 am' },
    { text: '12:00 pm', value: '12:00 pm' },
    { text: '12:30 pm', value: '12:30 pm' },
    { text: '01:00 pm', value: '01:00 pm' },
    { text: '01:30 pm', value: '01:30 pm' },
    { text: '02:00 pm', value: '02:00 pm' },
    { text: '02:30 pm', value: '02:30 pm' },
    { text: '03:00 pm', value: '03:00 pm' },
    { text: '03:30 pm', value: '03:30 pm' },
    { text: '04:00 pm', value: '04:00 pm' },
    { text: '04:30 pm', value: '04:30 pm' },
    { text: '05:00 pm', value: '05:00 pm' },
    { text: '05:30 pm', value: '05:30 pm' },
    { text: '06:00 pm', value: '06:00 pm' },
    { text: '06:30 pm', value: '06:30 pm' },
    { text: '07:00 pm', value: '07:00 pm' },
    { text: '07:30 pm', value: '07:30 pm' },
    { text: '08:00 pm', value: '08:00 pm' },
    { text: '08:30 pm', value: '08:30 pm' },
    { text: '09:00 pm', value: '09:00 pm' },
    { text: '09:30 pm', value: '09:30 pm' },
    { text: '10:00 pm', value: '10:00 pm' },
    { text: '10:30 pm', value: '10:30 pm' },
    { text: '11:00 pm', value: '11:00 pm' },
    { text: '11:30 pm', value: '11:30 pm' },
];

type TBusinessHourModalEditProps = {
    data: {
        day: JSX.Element;
        short_day: JSX.Element;
        time: JSX.Element;
        start_time?: string;
        end_time?: string;
        value: string;
    }[];
};

const BusinessHourModalEdit = ({ data }: TBusinessHourModalEditProps) => {
    const today = new Date().getDay();

    return (
        <div className='business-hour-modal-edit'>
            <div className='business-hour-modal-edit__days'>
                {data.map(day => {
                    const has_no_times = !day.start_time && !day.end_time;

                    return (
                        <Text
                            as='button'
                            className={classNames('business-hour-modal-edit__days-circle', {
                                'business-hour-modal-edit__days-circle--unselected': has_no_times,
                            })}
                            color={has_no_times ? 'general' : 'colored-background'}
                            key={day.value}
                        >
                            {day.short_day}
                        </Text>
                    );
                })}
            </div>
            <SeparatorContainerLine />
            <div className='business-hour-modal-edit__selector'>
                {data.map((day, idx) => {
                    const text_weight = idx === today - 1 ? 'bold' : 'normal';
                    const has_times = day.start_time && day.end_time;

                    return (
                        <div className='business-hour-modal-edit__selector-item' key={`${day.value}_${day.start_time}`}>
                            <Text
                                className='business-hour-modal-edit__selector-item-text'
                                size='xxs'
                                weight={text_weight}
                            >
                                {day.day}
                            </Text>
                            <div
                                className={classNames('business-hour-modal-edit__selector-item__dropdown', {
                                    'business-hour-modal-edit__selector-item__dropdown--single': !has_times,
                                })}
                            >
                                {has_times ? (
                                    <div
                                        className={classNames(
                                            'business-hour-modal-edit__selector-item__dropdown-group',
                                            {
                                                'business-hour-modal-edit__selector-item__dropdown-group--bold':
                                                    idx === today - 1,
                                            }
                                        )}
                                    >
                                        <Dropdown
                                            is_align_text_left
                                            list={hours_list}
                                            should_animate_suffix_icon
                                            suffix_icon='IcArrowDropDown'
                                            value={day.start_time}
                                        />
                                        <Text size='xxs'>
                                            <Localize i18n_default_text='to' />
                                        </Text>
                                        <Dropdown
                                            is_align_text_left
                                            list={hours_list}
                                            should_animate_suffix_icon
                                            suffix_icon='IcArrowDropDown'
                                            value={day.end_time}
                                        />
                                    </div>
                                ) : (
                                    <Dropdown
                                        disabled
                                        list={[
                                            { text: localize('Open 24 hours'), value: localize('Open 24 hours') },
                                            { text: localize('Open 24 hours'), value: localize('Open 24 hours') },
                                        ]}
                                        should_animate_suffix_icon
                                        suffix_icon='IcArrowDropDown'
                                        value={localize('Open 24 hours')}
                                    />
                                )}
                            </div>
                            <Icon icon='IcResetTime' />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BusinessHourModalEdit;
