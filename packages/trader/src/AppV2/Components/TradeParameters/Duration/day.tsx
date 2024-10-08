import { ActionSheet, Text, TextField } from '@deriv-com/quill-ui';
import { LabelPairedCalendarSmRegularIcon, LabelPairedClockThreeSmRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import React, { useEffect, useState } from 'react';

import DaysDatepicker from './datepicker';
import EndTimePicker from './timepicker';
import { useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { hasIntradayDurationUnit, setTime, toMoment } from '@deriv/shared';
import { getBoundaries } from 'Stores/Modules/Trading/Helpers/end-time';
import {
    getClosestTimeToCurrentGMT,
    getDatePickerStartDate,
    getProposalRequestObject,
} from 'AppV2/Utils/trade-params-utils';
import { useDtraderQuery } from 'AppV2/Hooks/useDtraderQuery';
import { ProposalResponse } from 'Stores/Modules/Trading/trade-store';

const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

const DayInput = ({
    setEndTime,
    setEndDate,
    end_date,
    end_time,
    temp_expiry_time,
    setTempExpiryTime,
}: {
    setEndTime: (arg: string) => void;
    setEndDate: (arg: Date) => void;
    end_date: Date;
    end_time: string;
    temp_expiry_time: string;
    setTempExpiryTime: (arg: string) => void;
}) => {
    const [current_gmt_time, setCurrentGmtTime] = React.useState<string>('');
    const [open, setOpen] = React.useState(false);
    const [open_timepicker, setOpenTimePicker] = React.useState(false);
    const { common } = useStore();
    const [day, setDay] = useState<number | null>(null);
    const { server_time } = common;
    const {
        expiry_date,
        market_open_times,
        market_close_times,
        duration_units_list,
        start_date,
        start_time,
        duration_min_max,
        trade_types,
        contract_type,
    } = useTraderStore();
    const trade_store = useTraderStore();

    const new_values = {
        duration_unit: 'd',
        duration: day || '',
        expiry_time: null,
        expiry_type: 'duration',
        contract_type,
    };
    const proposal_req = getProposalRequestObject({
        new_values,
        trade_store,
        trade_type: Object.keys(trade_types)[0],
    });

    const { data: response } = useDtraderQuery<ProposalResponse>(['proposal', JSON.stringify(day)], proposal_req, {
        enabled: day !== null,
    });

    useEffect(() => {
        if (response?.proposal?.date_expiry) {
            setTempExpiryTime(
                new Date((response?.proposal?.date_expiry as number) * 1000).toISOString().split('T')[1].substring(0, 8)
            );
        }
    }, [response, setTempExpiryTime]);

    const moment_expiry_date = toMoment(expiry_date);
    const market_open_datetimes = market_open_times.map(open_time => setTime(moment_expiry_date.clone(), open_time));
    const market_close_datetimes = market_close_times.map(close_time =>
        setTime(moment_expiry_date.clone(), close_time)
    );
    const server_datetime = toMoment(server_time);
    const boundaries = getBoundaries(server_datetime.clone(), market_open_datetimes, market_close_datetimes);
    const adjusted_start_time =
        boundaries.start[0]?.clone().add(5, 'minutes').format('HH:mm') || getClosestTimeToCurrentGMT(5);

    const formatted_date = end_date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
    const formatted_current_date = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    React.useEffect(() => {
        const updateCurrentGmtTime = () => {
            const now = new Date();
            const gmt_time = now.toLocaleTimeString('en-GB', { timeZone: 'GMT', hour12: false });
            setCurrentGmtTime(gmt_time);
        };
        updateCurrentGmtTime();
        const interval = setInterval(updateCurrentGmtTime, 1000);
        if (
            end_time !== '' &&
            Math.abs(timeToMinutes(adjusted_start_time) - timeToMinutes(end_time)) === 5 &&
            !open_timepicker
        ) {
            setEndTime(adjusted_start_time);
        }
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [end_time, adjusted_start_time]);

    useEffect(() => {
        if (formatted_date === formatted_current_date && !end_time) {
            setEndTime(adjusted_start_time);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [end_date]);

    let is_24_hours_contract = false;

    const has_intraday_duration_unit = hasIntradayDurationUnit(duration_units_list);
    is_24_hours_contract =
        (!!start_date || toMoment(expiry_date || end_date).isSame(toMoment(server_time), 'day')) &&
        has_intraday_duration_unit;

    const handleDate = (date: Date) => {
        const difference_in_time = date.getTime() - new Date().getTime();
        const difference_in_days = Math.ceil(difference_in_time / (1000 * 3600 * 24));
        setDay(Number(difference_in_days));
        setEndDate(date);
    };
    return (
        <div className='duration-container__days-input'>
            <TextField
                variant='fill'
                readOnly
                name='date'
                data-testid='dt_date_input'
                textAlignment='center'
                value={formatted_date}
                disabled={duration_units_list.filter(item => item.value === 'd').length === 0}
                onClick={() => {
                    setOpen(true);
                }}
                leftIcon={<LabelPairedCalendarSmRegularIcon width={24} height={24} />}
            />

            <TextField
                variant='fill'
                readOnly
                textAlignment='center'
                name='time'
                value={`${(is_24_hours_contract ? end_time : temp_expiry_time) || '23:59:59'} GMT`}
                disabled={formatted_date !== formatted_current_date || !is_24_hours_contract}
                onClick={() => {
                    setOpenTimePicker(true);
                }}
                leftIcon={<LabelPairedClockThreeSmRegularIcon width={24} height={24} />}
            />

            <div className='duration-container__days-input__expiry'>
                <Text size='sm' color='quill-typography__color--subtle'>
                    <Localize i18n_default_text='Expiry' />
                </Text>
                <Text size='sm'>{`
                ${formatted_date} ${(is_24_hours_contract ? end_time : temp_expiry_time) || '23:59:59'} GMT`}</Text>
            </div>
            <ActionSheet.Root
                isOpen={open || open_timepicker}
                onClose={() => {
                    setOpen(false);
                    setOpenTimePicker(false);
                }}
                position='left'
                expandable={false}
            >
                <ActionSheet.Portal shouldCloseOnDrag>
                    <ActionSheet.Header
                        title={
                            open ? (
                                <Localize i18n_default_text='Pick an end date' />
                            ) : (
                                <Localize i18n_default_text='Pick an end time' />
                            )
                        }
                    />
                    {open && (
                        <DaysDatepicker
                            start_date={getDatePickerStartDate(
                                duration_units_list,
                                server_time,
                                start_time,
                                duration_min_max
                            )}
                            end_date={end_date}
                            setEndDate={handleDate}
                        />
                    )}
                    {open_timepicker && (
                        <EndTimePicker
                            setEndTime={setEndTime}
                            end_time={end_time}
                            current_gmt_time={current_gmt_time}
                            adjusted_start_time={adjusted_start_time}
                        />
                    )}
                    <ActionSheet.Footer
                        alignment='vertical'
                        shouldCloseOnPrimaryButtonClick={false}
                        primaryAction={{
                            content: <Localize i18n_default_text='Done' />,
                            onAction: () => {
                                setOpen(false);
                                setOpenTimePicker(false);
                                if (formatted_date !== formatted_current_date) {
                                    setEndTime('');
                                }
                            },
                        }}
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </div>
    );
};

export default DayInput;
