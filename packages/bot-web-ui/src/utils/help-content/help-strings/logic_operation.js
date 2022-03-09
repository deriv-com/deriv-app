import { localize } from '@deriv/translations';

export default {
    text: [
        localize('This block performs the "AND" or the "OR" logic operation with the given values.'),
        localize(
            'In case if the "AND" operation is selected, the block returns "True" only if both given values are "True"'
        ),
        localize(
            'In case if the "OR" operation is selected, the block returns "True" in case if one or both given values are "True"'
        ),
    ],
};
