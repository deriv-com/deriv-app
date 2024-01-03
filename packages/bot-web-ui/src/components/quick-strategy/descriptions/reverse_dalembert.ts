import { localize } from '@deriv/translations';
import { TDescriptionItem } from '../types';

export const REVERSE_D_ALEMBERT: TDescriptionItem[] = [
    {
        type: 'subtitle',
        content: [localize('')],
        expanded: true,
        no_collapsible: false,
    },
    {
        type: 'text',
        content: [
            localize(
                "The Reverse D'Alembert strategy increases the stake after a successful trade and reduces the stake after a losing trade by the number of units that traders decide.One unit is equal to the amount of the initial stake.To manage risk, set the maximum stake for a single trade.The stake for the next trade will reset to the initial stake if it exceeds the maximum stake."
            ),
        ],
    },
];
