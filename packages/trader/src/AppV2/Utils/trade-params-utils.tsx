import React from 'react';
import {
    CONTRACT_TYPES,
    isTouchContract,
    isTurbosContract,
    isVanillaContract,
    shouldShowExpiration,
    TRADE_TYPES,
} from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';

export const getTradeParams = (symbol?: string) => ({
    [TRADE_TYPES.RISE_FALL]: ['duration', 'stake', 'allow_equals'],
    [TRADE_TYPES.RISE_FALL_EQUAL]: ['duration', 'stake', 'allow_equals'],
    [TRADE_TYPES.HIGH_LOW]: ['trade_type_tabs', 'duration', 'barrier', 'stake'],
    [TRADE_TYPES.TOUCH]: ['trade_type_tabs', 'duration', 'barrier', 'stake'],
    [TRADE_TYPES.MATCH_DIFF]: ['last_digit', 'duration', 'stake'],
    [TRADE_TYPES.EVEN_ODD]: ['duration', 'stake'],
    [TRADE_TYPES.OVER_UNDER]: ['last_digit', 'duration', 'stake'],
    [TRADE_TYPES.ACCUMULATOR]: ['growth_rate', 'stake', 'take_profit', 'accu_info_display'],
    [TRADE_TYPES.MULTIPLIER]: [
        'multiplier',
        'stake',
        'risk_management',
        ...(shouldShowExpiration(symbol) ? ['expiration'] : []),
        'mult_info_display',
    ],
    [TRADE_TYPES.TURBOS.LONG]: ['trade_type_tabs', 'duration', 'payout_per_point', 'stake', 'take_profit'],
    [TRADE_TYPES.TURBOS.SHORT]: ['trade_type_tabs', 'duration', 'payout_per_point', 'stake', 'take_profit'],
    [TRADE_TYPES.VANILLA.CALL]: ['trade_type_tabs', 'duration', 'strike', 'stake'],
    [TRADE_TYPES.VANILLA.PUT]: ['trade_type_tabs', 'duration', 'strike', 'stake'],
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
    switching_DC,
    switching_TP_SL,
}: {
    has_cancellation?: boolean;
    has_take_profit?: boolean;
    has_stop_loss?: boolean;
    switching_DC?: boolean;
    switching_TP_SL?: boolean;
}) => {
    if (switching_DC && has_cancellation) {
        if (has_take_profit && has_stop_loss) return <Localize i18n_default_text='TP and SL have been turned off.' />;
        if (has_take_profit) return <Localize i18n_default_text='TP has been turned off.' />;
        if (has_stop_loss) return <Localize i18n_default_text='SL has been turned off.' />;
    }
    if (switching_TP_SL && (has_take_profit || has_stop_loss) && has_cancellation)
        return <Localize i18n_default_text='DC has been turned off.' />;
};
