import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { ActionSheet, TextField, useSnackbar } from '@deriv-com/quill-ui';
import { getUnitMap } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import DurationActionSheetContainer from './container';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';
import { getDatePickerStartDate, getSmallestDuration } from 'AppV2/Utils/trade-params-utils';
import { useStore } from '@deriv/stores';
import { TTradeParametersProps } from '../trade-parameters';

const Duration = observer(({ is_minimized }: TTradeParametersProps) => {
    const {
        contract_type,
        duration_min_max,
        duration_unit,
        duration_units_list,
        duration,
        expiry_epoch,
        expiry_time,
        expiry_type,
        is_market_closed,
        onChangeMultiple,
        proposal_info,
        saved_expiry_date_v2,
        setSavedExpiryDateV2,
        setUnsavedExpiryDateV2,
        start_time,
        symbol,
        trade_type_tab,
        trade_types,
        unsaved_expiry_date_v2,
        validation_errors,
    } = useTraderStore();
    const { addSnackbar } = useSnackbar();
    const { name_plural, name } = getUnitMap()[duration_unit] ?? {};
    const duration_unit_text = name_plural ?? name;
    const [selected_hour, setSelectedHour] = useState<number[]>([]);
    const [is_open, setOpen] = useState(false);
    const [expiry_time_string, setExpiryTimeString] = useState('');
    const [expiry_date_string, setExpiryDateString] = useState('');
    const [end_date, setEndDate] = useState<Date>(new Date());
    const [end_time, setEndTime] = useState<string>('');
    const [unit, setUnit] = useState(expiry_time ? 'd' : duration_unit);
    const contract_type_object = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);
    const has_error =
        (proposal_info[contract_type_object[0]]?.has_error &&
            proposal_info[contract_type_object[0]]?.error_field === 'duration') ||
        validation_errors.duration.length > 0;
    const isInitialMount = useRef(true);
    const { common, client } = useStore();
    const { is_logged_in } = client;
    const { server_time } = common;

    useEffect(() => {
        if (expiry_epoch) {
            setExpiryTimeString(
                new Date((expiry_epoch as number) * 1000).toISOString().split('T')[1].substring(0, 8) || ''
            );

            const new_date_string = new Date((expiry_epoch as number) * 1000).toISOString().split('T')[0];
            setExpiryDateString(new Date((expiry_epoch as number) * 1000).toISOString().split('T')[0]);
            setSavedExpiryDateV2(new_date_string);
        }
    }, [expiry_epoch]);

    useEffect(() => {
        if (duration_unit == 'd') {
            const newDate = new Date();
            newDate.setDate(newDate.getDate() + duration);
            setEndDate(newDate);
        }
    }, [duration_unit]);

    useEffect(() => {
        if (isInitialMount.current) {
            const timer = setTimeout(() => {
                isInitialMount.current = false;
            }, 500);
            return () => clearTimeout(timer);
        }

        const result = getSmallestDuration(duration_min_max, duration_units_list);
        if (result?.unit == 'd') {
            setEndDate(new Date());
        }

        const start_duration = setTimeout(() => {
            onChangeMultiple({
                duration_unit: result?.unit,
                duration: result?.value,
                expiry_time: null,
                expiry_type: 'duration',
            });
        }, 10);

        const start_date = getDatePickerStartDate(duration_units_list, server_time, start_time, duration_min_max);

        setEndDate(new Date(start_date));

        return () => clearTimeout(start_duration);
    }, [symbol, contract_type, duration_min_max, duration_units_list]);

    const onClose = React.useCallback(() => setOpen(false), []);

    const getInputValues = () => {
        const formatted_date = saved_expiry_date_v2
            ? new Date(saved_expiry_date_v2).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
              })
            : '';
        if (expiry_type == 'duration') {
            if (duration_unit === 'm' && duration > 59) {
                const hours = Math.floor(duration / 60);
                const minutes = duration % 60;
                return `${hours} ${localize('hours')} ${minutes ? `${minutes} ${localize('minutes')}` : ''} `;
            } else if (duration_unit === 'd') {
                if (!formatted_date) {
                    return '';
                }
                return `${localize('Ends on')} ${formatted_date}, ${expiry_time_string || '23:59:59'} GMT`;
            }
            return `${duration} ${duration_unit_text}`;
        }
        if (expiry_time) {
            return `${localize('Ends on')} ${formatted_date} ${expiry_time} GMT`;
        }
    };

    useEffect(() => {
        if (has_error && !is_minimized) {
            const error_obj = proposal_info[contract_type_object[0]] || validation_errors?.duration?.[0];
            if (error_obj?.error_field === 'duration') {
                addSnackbar({
                    message: error_obj.message,
                    status: 'fail',
                    hasCloseButton: true,
                    hasFixedHeight: false,
                    style: {
                        marginBottom: is_logged_in ? '48px' : '-8px',
                        width: 'calc(100% - var(--core-spacing-800)',
                    },
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [has_error, contract_type_object[0]]);

    const handleHour = React.useCallback(() => {
        if (expiry_time) {
            setUnit('d');
            setEndTime(expiry_time);
        } else {
            // eslint-disable-next-line no-lonely-if
            if (duration_unit === 'm' && duration > 59) {
                const hour = Math.floor(duration / 60);
                const minutes = duration % 60;
                setUnit('h');
                setSelectedHour([hour, minutes]);
            } else {
                setSelectedHour([]);
                setUnit(duration_unit);
            }
        }
    }, [duration, duration_unit, expiry_time]);

    useEffect(() => {
        if (is_open) {
            handleHour();
        }
    }, [is_open]);

    return (
        <>
            <TextField
                variant='fill'
                key={`${duration}-$${duration_unit}`}
                readOnly
                label={<Localize i18n_default_text='Duration' key={`duration${is_minimized ? '-minimized' : ''}`} />}
                value={getInputValues()}
                noStatusIcon
                disabled={is_market_closed}
                className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                onClick={() => setOpen(true)}
                status={has_error ? 'error' : 'neutral'}
            />
            <ActionSheet.Root
                isOpen={is_open}
                onClose={onClose}
                position='left'
                expandable={false}
                shouldBlurOnClose={is_open}
            >
                <ActionSheet.Portal shouldCloseOnDrag>
                    <DurationActionSheetContainer
                        selected_hour={selected_hour}
                        setSelectedHour={setSelectedHour}
                        unit={unit}
                        setUnit={setUnit}
                        expiry_time_string={expiry_time_string}
                        setExpiryTimeString={setExpiryTimeString}
                        end_time={end_time}
                        setEndTime={setEndTime}
                        saved_expiry_date_v2={saved_expiry_date_v2}
                        setSavedExpiryDateV2={setSavedExpiryDateV2}
                        unsaved_expiry_date_v2={unsaved_expiry_date_v2}
                        setUnsavedExpiryDateV2={setUnsavedExpiryDateV2}
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </>
    );
});

export default Duration;
