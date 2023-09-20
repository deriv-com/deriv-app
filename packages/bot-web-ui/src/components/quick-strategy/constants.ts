import { localize } from '@deriv/translations';

export const STRATEGIES = {
    MARTINGALE: {
        label: localize('Martingale'),
        description: localize(
            'The Martingale doubles your stake after a loss and resets your stake after a win or when the pre-determined number of consecutive losses is reached. You decide your profit threshold, loss threshold, initial stake, and the number of consecutive losses before your stake resets.'
        ),
    },
    D_ALEMBERT: {
        label: localize('D’Alembert'),
        description: localize(
            'The concept of the D’Alembert Strategy is said to be similar to the Martingale Strategy where you will increase your contract size after a loss. With the D’Alembert Strategy, you will also decrease your contract size after a successful trade.'
        ),
    },
    OSCARS_GRIND: {
        label: localize('Oscar’s Grind'),
        description: localize(
            'The Oscar’s Grind Strategy is a low-risk positive progression strategy that first appeared in 1965. By using this strategy, the size of your contract will increase after successful trades, but remains unchanged after unsuccessful trades.'
        ),
    },
};

export const FORM_TABS = [
    {
        label: localize('Trade Parameters'),
        value: 'TRADE_PARAMETERS',
    },
    {
        label: localize('Description'),
        value: 'DESCRIPTION',
        disabled: true,
    },
];
