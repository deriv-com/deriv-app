import {
    CONTRACT_TYPES,
    isTouchContract,
    isTurbosContract,
    isVanillaContract,
    shouldShowExpiration,
    TRADE_TYPES,
} from '@deriv/shared';

export const getTradeParams = (symbol?: string) => ({
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
    },
    [TRADE_TYPES.TOUCH]: {
        trade_type_tabs: true,
        duration: true,
        barrier: true,
        stake: true,
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

export const getOptionPerUnit = (unit: string): { value: number; label: string }[][] => {
    let start = 0;
    let end = 0;
    let label = '';

    const generateOptions = (start: number, end: number, label: string) => {
        return Array.from({ length: end - start + 1 }, (_, i) => ({
            value: start + i,
            label: `${start + i} ${label}`,
        }));
    };

    switch (unit) {
        case 'm':
            start = 1;
            end = 59;
            label = 'min';
            break;
        case 's':
            start = 15;
            end = 59;
            label = 'sec';
            break;
        case 'd':
            start = 1;
            end = 365;
            label = 'days';
            break;
        case 't':
            start = 1;
            end = 10;
            label = 'tick';
            break;
        case 'h': {
            const housr_options = generateOptions(1, 23, 'h');
            const minute_options = generateOptions(1, 59, 'min');
            return [housr_options, minute_options];
        }
        default:
            return [[]];
    }

    return [generateOptions(start, end, label)];
};
