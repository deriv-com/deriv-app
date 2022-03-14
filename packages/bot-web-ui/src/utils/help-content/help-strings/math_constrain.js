import { localize } from '@deriv/translations';

export default {
    text: [
        localize('This block constrains a given number within a set range.'),
        localize(
            'In case if the given number is less than the lower boundary of the range, the block returns the lower boundary value. Similarly, if the given number is greater than the higher boundary, the block will return the higher boundary value. In case if the given value is between boundaries, the block will return the given value unchanged.'
        ),
        localize(
            'In the below example the block returns the value of 10 as the given value (5) is less than the lower boundary (10)'
        ),
    ],
};
