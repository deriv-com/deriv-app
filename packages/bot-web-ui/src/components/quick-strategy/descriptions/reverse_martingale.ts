import { localize } from '@deriv/translations';
import { TDescriptionItem } from '../types';

export const REVERSE_MARTINGALE: TDescriptionItem[] = [
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
                'The Reverse Martingale strategy multiplies the stake by the chosen multiplier after every successful trade. The stake for the next trade will reset to the initial stake after a losing trade. To manage risk, set the maximum stake for a single trade. The stake for the next trade will reset to the initial stake if it exceeds the maximum stake.'
            ),
        ],
    },
];
