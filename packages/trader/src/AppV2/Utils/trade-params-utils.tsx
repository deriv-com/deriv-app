import {
    CONTRACT_TYPES,
    isTimeValid,
    isTouchContract,
    isTurbosContract,
    isVanillaContract,
    shouldShowExpiration,
    TRADE_TYPES,
} from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { Moment } from 'moment';
import React from 'react';

export const getTradeParams = (symbol?: string, has_cancellation?: boolean) => ({
    [TRADE_TYPES.RISE_FALL]: {
        duration: true,
        stake: true,
        allow_equals: true,
    },
    [TRADE_TYPES.RISE_FALL_EQUAL]: {
        duration: true,
        stake: true,
        allow_equals: true,
    },
    [TRADE_TYPES.HIGH_LOW]: {
        trade_type_tabs: true,
        duration: true,
        barrier: true,
        stake: true,
        payout: true,
    },
    [TRADE_TYPES.TOUCH]: {
        trade_type_tabs: true,
        duration: true,
        barrier: true,
        stake: true,
        payout: true,
    },
    [TRADE_TYPES.MATCH_DIFF]: {
        last_digit: true,
        duration: true,
        stake: true,
    },
    [TRADE_TYPES.EVEN_ODD]: {
        duration: true,
        stake: true,
    },
    [TRADE_TYPES.OVER_UNDER]: {
        last_digit: true,
        duration: true,
        stake: true,
    },
    [TRADE_TYPES.ACCUMULATOR]: {
        growth_rate: true,
        stake: true,
        take_profit: true,
        accu_info_display: true,
    },
    [TRADE_TYPES.MULTIPLIER]: {
        multiplier: true,
        stake: true,
        risk_management: true,
        ...(has_cancellation ? { mult_info_display: true } : {}),
        ...(shouldShowExpiration(symbol) ? { expiration: true } : {}),
    },
    [TRADE_TYPES.TURBOS.LONG]: {
        trade_type_tabs: true,
        duration: true,
        payout_per_point: true,
        stake: true,
        take_profit: true,
        barrier_info: true,
    },
    [TRADE_TYPES.TURBOS.SHORT]: {
        trade_type_tabs: true,
        duration: true,
        payout_per_point: true,
        stake: true,
        take_profit: true,
        barrier_info: true,
    },
    [TRADE_TYPES.VANILLA.CALL]: {
        trade_type_tabs: true,
        duration: true,
        strike: true,
        stake: true,
        payout_per_point_info: true,
    },
    [TRADE_TYPES.VANILLA.PUT]: {
        trade_type_tabs: true,
        duration: true,
        strike: true,
        stake: true,
        payout_per_point_info: true,
    },
});

export const isDigitContractWinning = (
    contract_type: string | undefined,
    selected_digit: number | null,
    current_digit: number | null
) => {
    const win_conditions = {
        [CONTRACT_TYPES.MATCH_DIFF.MATCH]: current_digit === selected_digit,
        [CONTRACT_TYPES.MATCH_DIFF.DIFF]: current_digit !== selected_digit,
        [CONTRACT_TYPES.OVER_UNDER.OVER]:
            !!((current_digit || current_digit === 0) && (selected_digit || selected_digit === 0)) &&
            current_digit > selected_digit,
        [CONTRACT_TYPES.OVER_UNDER.UNDER]:
            !!((current_digit || current_digit === 0) && (selected_digit || selected_digit === 0)) &&
            current_digit < selected_digit,
        [CONTRACT_TYPES.EVEN_ODD.ODD]: !!current_digit && Boolean(current_digit % 2),
        [CONTRACT_TYPES.EVEN_ODD.EVEN]: (!!current_digit && !(current_digit % 2)) || current_digit === 0,
    } as { [key: string]: boolean };
    if (!contract_type || !win_conditions[contract_type]) return false;
    return win_conditions[contract_type];
};

export const focusAndOpenKeyboard = (focused_input?: HTMLInputElement | null, main_input?: HTMLInputElement | null) => {
    if (main_input && focused_input) {
        // Reveal a temporary input element and put focus on it
        focused_input.style.display = 'block';
        focused_input.focus({ preventScroll: true });

        // The keyboard is open, so now adding a delayed focus on the target element and hide the temporary input element
        return setTimeout(() => {
            main_input.focus();
            main_input.click();
            focused_input.style.display = 'none';
        }, 300);
    }
};

export const getTradeTypeTabsList = (contract_type = '') => {
    const is_turbos = isTurbosContract(contract_type);
    const is_vanilla = isVanillaContract(contract_type);
    const is_high_low = contract_type === TRADE_TYPES.HIGH_LOW;
    const is_touch = isTouchContract(contract_type);
    const tab_list = [
        {
            label: 'Up',
            value: TRADE_TYPES.TURBOS.LONG,
            contract_type: CONTRACT_TYPES.TURBOS.LONG,
            is_displayed: is_turbos,
        },
        {
            label: 'Down',
            value: TRADE_TYPES.TURBOS.SHORT,
            contract_type: CONTRACT_TYPES.TURBOS.SHORT,
            is_displayed: is_turbos,
        },
        {
            label: 'Call',
            value: TRADE_TYPES.VANILLA.CALL,
            contract_type: CONTRACT_TYPES.VANILLA.CALL,
            is_displayed: is_vanilla,
        },
        {
            label: 'Put',
            value: TRADE_TYPES.VANILLA.PUT,
            contract_type: CONTRACT_TYPES.VANILLA.PUT,
            is_displayed: is_vanilla,
        },
        { label: 'Higher', value: TRADE_TYPES.HIGH_LOW, contract_type: CONTRACT_TYPES.CALL, is_displayed: is_high_low },
        { label: 'Lower', value: TRADE_TYPES.HIGH_LOW, contract_type: CONTRACT_TYPES.PUT, is_displayed: is_high_low },
        {
            label: 'Touch',
            value: TRADE_TYPES.TOUCH,
            contract_type: CONTRACT_TYPES.TOUCH.ONE_TOUCH,
            is_displayed: is_touch,
        },
        {
            label: 'No Touch',
            value: TRADE_TYPES.TOUCH,
            contract_type: CONTRACT_TYPES.TOUCH.NO_TOUCH,
            is_displayed: is_touch,
        },
    ];
    return tab_list.filter(({ is_displayed }) => is_displayed);
};

export const isSmallScreen = () => window.innerHeight <= 640;

export const addUnit = ({
    value,
    unit = localize('min'),
    should_add_space = true,
}: {
    value: string | number;
    unit?: string;
    should_add_space?: boolean;
}) => `${typeof value === 'number' ? value : parseInt(value)}${should_add_space ? ' ' : ''}${unit}`;

export const getSnackBarText = ({
    has_cancellation,
    has_take_profit,
    has_stop_loss,
    switching_cancellation,
    switching_tp_sl,
}: {
    has_cancellation?: boolean;
    has_take_profit?: boolean;
    has_stop_loss?: boolean;
    switching_cancellation?: boolean;
    switching_tp_sl?: boolean;
}) => {
    if (switching_cancellation && has_cancellation) {
        if (has_take_profit && has_stop_loss) return <Localize i18n_default_text='TP and SL have been turned off.' />;
        if (has_take_profit) return <Localize i18n_default_text='TP has been turned off.' />;
        if (has_stop_loss) return <Localize i18n_default_text='SL has been turned off.' />;
    }
    if (switching_tp_sl && (has_take_profit || has_stop_loss) && has_cancellation)
        return <Localize i18n_default_text='DC has been turned off.' />;
};

export const getClosestTimeToCurrentGMT = (interval: number): string => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);

    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC',
    };
    const formattedTime = new Intl.DateTimeFormat('en-GB', options).format(now);

    const [hours, minutes] = formattedTime.split(':').map(Number);

    const date = new Date();
    date.setUTCHours(hours);
    date.setUTCMinutes(minutes);

    const roundedMinutes = Math.ceil(date.getUTCMinutes() / interval) * interval;

    if (roundedMinutes >= 60) {
        date.setUTCHours(date.getUTCHours() + 1);
        date.setUTCMinutes(0);
    } else {
        date.setUTCMinutes(roundedMinutes);
    }

    const newHours = String(date.getUTCHours()).padStart(2, '0');
    const newMinutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${newHours}:${newMinutes}`;
};

export const getOptionPerUnit = (
    unit: string,
    duration_min_max: Record<string, { min: number; max: number }>
): { value: number; label: React.ReactNode }[][] => {
    const generateOptions = (start: number, end: number, label: React.ReactNode) => {
        return Array.from({ length: end - start + 1 }, (_, i) => ({
            value: start + i,
            label: (
                <React.Fragment key={start + i}>
                    {start + i} {label}
                </React.Fragment>
            ),
        }));
    };

    const { intraday, tick, daily } = duration_min_max;
    const unitConfig: Record<
        string,
        { start: number; end: number; label: React.ReactNode } | (() => { value: number; label: React.ReactNode }[][])
    > = {
        m: {
            start: Math.max(1, intraday?.min / 60),
            end: Math.min(59, intraday?.max / 60),
            label: <Localize i18n_default_text='min' />,
        },
        s: {
            start: Math.max(15, intraday?.min),
            end: Math.min(59, intraday?.max),
            label: <Localize i18n_default_text='sec' />,
        },
        d: {
            start: Math.max(1, daily?.min / 86400),
            end: Math.min(365, daily?.max / 86400),
            label: <Localize i18n_default_text='days' />,
        },
        t: {
            start: Math.max(1, tick?.min),
            end: Math.min(10, tick?.max),
            label: <Localize i18n_default_text='tick' />,
        },
        h: () => {
            const hour_start = Math.max(1, Math.floor(intraday?.min / 3600));
            const hour_end = Math.min(24, Math.floor(intraday?.max / 3600));

            const hour_options = generateOptions(hour_start, hour_end, <Localize i18n_default_text='h' />);

            const minute_start = 0;

            let minute_end = 0;
            if (intraday?.max % 3600 !== 0) {
                minute_end = Math.floor((intraday?.max % 3600) / 60);
            } else if (intraday?.max >= 86400) {
                minute_end = 59;
            }

            const minute_options = generateOptions(minute_start, minute_end, <Localize i18n_default_text='min' />);

            return [hour_options, minute_options];
        },
    };

    const config = unitConfig[unit];

    if (typeof config === 'function') {
        return config();
    }

    if (config) {
        const { start, end, label } = config;
        return [generateOptions(Math.ceil(start), Math.floor(end), label)];
    }

    return [[]];
};

export const getSmallestDuration = (
    obj: { [x: string]: { min: number; max: number } | { min: number } },
    durationUnits: any[]
) => {
    const keysPriority = ['tick', 'intraday', 'daily'];
    let smallestValueInSeconds = Infinity;
    let smallestUnit: 's' | 'm' | 'h' | 'd' | null = null;

    // eslint-disable-next-line no-restricted-syntax
    for (const key of keysPriority) {
        if (obj[key]) {
            if (key === 'tick') {
                const tickUnit = durationUnits.find((item: { value: string }) => item.value === 't');
                if (tickUnit) {
                    return { value: obj[key].min, unit: 't' };
                }
            }

            if (obj[key].min < smallestValueInSeconds) {
                smallestValueInSeconds = obj[key].min;

                if (key === 'intraday') {
                    if (smallestValueInSeconds >= 60 && smallestValueInSeconds < 3600) {
                        smallestUnit = 'm';
                    } else if (smallestValueInSeconds >= 3600 && smallestValueInSeconds < 86400) {
                        smallestUnit = 'h';
                    }
                } else if (key === 'daily') {
                    smallestUnit = 'd';
                }
            }
        }
    }

    if (smallestUnit) {
        const validUnit = durationUnits.find((item: { value: string; text: string }) => item.value === smallestUnit);
        if (validUnit) {
            let convertedValue;
            switch (smallestUnit) {
                case 'm':
                    convertedValue = smallestValueInSeconds / 60;
                    break;
                case 'h':
                    convertedValue = smallestValueInSeconds / 3600;
                    break;
                case 'd':
                    convertedValue = smallestValueInSeconds / 86400;
                    break;
                default:
                    convertedValue = 1;
            }
            return { value: convertedValue, unit: smallestUnit };
        }
    }

    return null;
};

export const getDatePickerStartDate = (
    duration_units_list: { value: string }[],
    server_time: Moment,
    start_time: string | null,
    duration_min_max: Record<string, { min: number; max: number }>
) => {
    const hasIntradayDurationUnit = (duration_units_list: { value: string }[]) => {
        return duration_units_list.some((unit: { value: string }) => ['m', 'h'].indexOf(unit.value) !== -1);
    };

    const setMinTime = (dateObj: Date, time?: string) => {
        const [hour, minute, second] = time ? time.split(':') : [0, 0, 0];
        dateObj?.setHours(Number(hour));
        dateObj?.setMinutes(Number(minute) || 0);
        dateObj?.setSeconds(Number(second) || 0);
        return dateObj;
    };

    const toDate = (value: string | number | Date | Moment): Date => {
        if (!value) return new Date();

        if (value instanceof Date && !isNaN(value.getTime())) {
            return value;
        }

        if (typeof value === 'number') {
            return new Date(value * 1000);
        }

        const parsedDate = new Date(value as Date);
        if (isNaN(parsedDate.getTime())) {
            const today = new Date();
            const daysInMonth = new Date(today.getUTCFullYear(), today.getUTCMonth() + 1, 0).getDate();
            const valueAsNumber = Date.parse(value as string) / (1000 * 60 * 60 * 24);
            return valueAsNumber > daysInMonth
                ? new Date(today.setUTCDate(today.getUTCDate() + Number(value)))
                : new Date(value as Date);
        }

        return parsedDate;
    };

    const getMinDuration = (server_time: string | number | Date | Moment, duration_units_list: { value: string }[]) => {
        const server_date = toDate(server_time);
        return hasIntradayDurationUnit(duration_units_list)
            ? new Date(server_date)
            : new Date(server_date.getTime() + (duration_min_max?.daily?.min || 0) * 1000);
    };

    const getMomentContractStartDateTime = () => {
        const minDurationDate = getMinDuration(server_time, duration_units_list);
        const time = isTimeValid(start_time ?? '') ? start_time : server_time?.toISOString().substr(11, 8) ?? '';
        return setMinTime(minDurationDate, time ?? '');
    };

    const min_date = new Date(getMomentContractStartDateTime());
    return min_date;
};
