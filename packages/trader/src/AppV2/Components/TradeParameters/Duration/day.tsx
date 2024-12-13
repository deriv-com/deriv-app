import { ActionSheet, Text, TextField, useSnackbar } from '@deriv-com/quill-ui';
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
import { invalidateDTraderCache, useDtraderQuery } from 'AppV2/Hooks/useDtraderQuery';
import { ProposalResponse } from 'Stores/Modules/Trading/trade-store';

const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

const DayInput = ({
    end_time,
    expiry_time_input,
    saved_expiry_date_v2,
    setEndTime,
    setExpiryTimeInput,
    setUnsavedExpiryDateV2,
    unsaved_expiry_date_v2,
}: {
    end_time: string;
    expiry_time_input: string;
    saved_expiry_date_v2: string;
    setEndTime: (arg: string) => void;
    setExpiryTimeInput: (arg: string) => void;
    setUnsavedExpiryDateV2: (arg: string) => void;
    unsaved_expiry_date_v2: string;
}) => {
    const [current_gmt_time, setCurrentGmtTime] = React.useState<string>('');
    const [open, setOpen] = React.useState(false);
    const [open_timepicker, setOpenTimePicker] = React.useState(false);
    const [trigger_date, setTriggerDate] = useState(false);
    const [is_disabled, setIsDisabled] = useState(false);
    const [calendar_date_input, setCalendarDateInput] = useState(
        new Date(saved_expiry_date_v2 || unsaved_expiry_date_v2)
    );
    const [payout_per_point, setPayoutPerPoint] = useState<number | undefined>();
    const [barrier_value, setBarrierValue] = useState<string | undefined>();
    const { common } = useStore();
    const [day, setDay] = useState<number | null>(null);
    const { server_time } = common;
    const {
        barrier_1,
        contract_type,
        duration_min_max,
        duration_units_list,
        duration,
        expiry_date,
        is_turbos,
        market_close_times,
        market_open_times,
        start_date,
        start_time,
        symbol,
        tick_data,
        trade_types,
    } = useTraderStore();
    const trade_store = useTraderStore();
    const { addSnackbar } = useSnackbar();

    const new_values = {
        duration_unit: 'd',
        duration: day || duration,
        expiry_type: 'duration',
        contract_type,
        basis: 'stake',
        amount: '5',
        symbol,
        ...(payout_per_point && { payout_per_point }),
        ...(barrier_value && { barrier: barrier_value }),
    };

    const proposal_req = getProposalRequestObject({
        new_values,
        trade_store,
        trade_type: Object.keys(trade_types)[0],
    });

    const { data: response } = useDtraderQuery<ProposalResponse>(
        ['proposal', JSON.stringify(day), JSON.stringify(payout_per_point), JSON.stringify(barrier_value)],
        {
            ...proposal_req,
            symbol,
            ...(barrier_1 && !is_turbos && !barrier_value ? { barrier: Math.round(tick_data?.quote as number) } : {}),
        },
        {
            enabled: trigger_date,
        }
    );

    useEffect(() => {
        if (response) {
            if (response?.error?.code === 'ContractBuyValidationError') {
                const details = response.error.details;

                if (details?.field === 'payout_per_point' && details?.payout_per_point_choices) {
                    const suggested_payout = details?.payout_per_point_choices[0];
                    setPayoutPerPoint(suggested_payout);
                    setTriggerDate(true);
                    return;
                }

                if (details?.field === 'barrier' && details?.barrier_choices) {
                    const suggested_barrier = details?.barrier_choices[0];
                    setBarrierValue(suggested_barrier);
                    setTriggerDate(true);
                    return;
                }
            }

            if (response?.error?.message && response?.error?.details?.field === 'duration') {
                addSnackbar({
                    message: <Localize i18n_default_text={response?.error?.message} />,
                    status: 'fail',
                    hasCloseButton: true,
                    style: { marginBottom: '48px' },
                });
                setIsDisabled(true);
            } else {
                setIsDisabled(false);
            }

            if (response?.proposal?.date_expiry) {
                setExpiryTimeInput(
                    new Date((response?.proposal?.date_expiry as number) * 1000)
                        .toISOString()
                        .split('T')[1]
                        .substring(0, 8)
                );
            }

            invalidateDTraderCache([
                'proposal',
                JSON.stringify(day),
                JSON.stringify(payout_per_point),
                JSON.stringify(barrier_value),
            ]);
            setTriggerDate(false);
        }
    }, [response, setExpiryTimeInput, setUnsavedExpiryDateV2]);

    const moment_expiry_date = toMoment(expiry_date);
    const market_open_datetimes = market_open_times.map(open_time => setTime(moment_expiry_date.clone(), open_time));
    const market_close_datetimes = market_close_times.map(close_time =>
        setTime(moment_expiry_date.clone(), close_time)
    );
    const server_datetime = toMoment(server_time);
    const boundaries = getBoundaries(server_datetime.clone(), market_open_datetimes, market_close_datetimes);
    const adjusted_start_time =
        boundaries.start[0]?.clone().add(5, 'minutes').format('HH:mm') || getClosestTimeToCurrentGMT(5);

    const formatted_date = new Date(unsaved_expiry_date_v2).toLocaleDateString('en-GB', {
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
        // Adjusts end_time to match adjusted_start_time only if end_time is less than adjusted_start_time
        // and the difference is exactly 5 minutes, ensuring time remains valid.
        if (
            end_time !== '' &&
            timeToMinutes(end_time) < timeToMinutes(adjusted_start_time) &&
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
    }, [unsaved_expiry_date_v2]);

    let is_24_hours_contract = false;

    const has_intraday_duration_unit = hasIntradayDurationUnit(duration_units_list);
    const parsedFormattedDate = new Date(Date.parse(`${formatted_date} 00:00:00`));

    const isSameDate =
        parsedFormattedDate.getFullYear() === server_time.year() &&
        parsedFormattedDate.getMonth() === server_time.month() &&
        parsedFormattedDate.getDate() === server_time.date();

    is_24_hours_contract = (!!start_date || isSameDate) && has_intraday_duration_unit;

    const handleDate = (date: Date) => {
        const difference_in_time = date.getTime() - new Date().getTime();
        const difference_in_days = Math.ceil(difference_in_time / (1000 * 3600 * 24));
        setDay(Number(difference_in_days));
        setCalendarDateInput(date);
        if (difference_in_days == 0) {
            setEndTime(adjusted_start_time);
            const today = new Date().toISOString().split('T')[0];
            setUnsavedExpiryDateV2(today);
        } else {
            setEndTime('');
            setUnsavedExpiryDateV2(
                `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            );
        }
        setTriggerDate(true);
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
                value={`${(is_24_hours_contract ? end_time : expiry_time_input) || '23:59:59'} GMT`}
                disabled={!is_24_hours_contract}
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
                ${formatted_date} ${
                    (formatted_date === formatted_current_date ? end_time : expiry_time_input) || '23:59:59'
                } GMT`}</Text>
            </div>
            <ActionSheet.Root
                isOpen={open || open_timepicker}
                onClose={() => {
                    setOpen(false);
                    setOpenTimePicker(false);
                    setIsDisabled(false);
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
                            end_date={calendar_date_input}
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
                        isPrimaryButtonDisabled={is_disabled}
                        primaryAction={{
                            content: <Localize i18n_default_text='Done' />,
                            onAction: () => {
                                if (!is_disabled) {
                                    setOpen(false);
                                    setOpenTimePicker(false);
                                    const end_date = new Date(unsaved_expiry_date_v2).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    });

                                    if (end_date !== formatted_current_date) {
                                        setEndTime('');
                                    }
                                    if (timeToMinutes(adjusted_start_time) > timeToMinutes(end_time)) {
                                        setEndTime(adjusted_start_time);
                                    }
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
