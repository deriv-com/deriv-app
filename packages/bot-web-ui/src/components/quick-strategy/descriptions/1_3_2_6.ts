import { localize } from '@deriv/translations';
import { TDescriptionItem } from '../types';

export const _1_3_2_6: TDescriptionItem[] = [
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
                'The 1-3-2-6 strategy aims to maximise profits with four consecutive wins. One unit is equal to the amount of the initial stake. The stake will adjust from 1 unit to 3 units after the first successful trade, then to 2 units after your second successful trade, and to 6 units after the third successful trade. The stake for the next trade will reset to the initial stake if there is a losing trade or a completion of the trade cycle.'
            ),
        ],
    },
];
