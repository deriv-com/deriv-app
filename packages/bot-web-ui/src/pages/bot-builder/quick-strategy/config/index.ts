import { localize } from '@deriv/translations';
import { TStrategies } from '../types';
import {
    D_ALEMBERT,
    MARTINGALE,
    OSCARS_GRIND,
    REVERSE_D_ALEMBERT,
    REVERSE_MARTINGALE,
    STRATEGY_1_3_2_6,
} from './options';

export const FORM_TABS = [
    {
        label: localize('Trade parameters'),
        value: 'TRADE_PARAMETERS',
    },
    {
        label: localize('Learn more'),
        value: 'LEARN_MORE',
        disabled: true,
    },
];

export const STRATEGIES: TStrategies = {
    MARTINGALE,
    D_ALEMBERT,
    OSCARS_GRIND,
    REVERSE_MARTINGALE,
    REVERSE_D_ALEMBERT,
    STRATEGY_1_3_2_6,
};
