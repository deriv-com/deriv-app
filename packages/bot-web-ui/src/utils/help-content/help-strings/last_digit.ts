import { localize } from '@deriv/translations';

export default {
    text: [
        localize(
            'This block gives you the last digit of the latest tick value of the selected market. If the latest tick value is 1410.90, this block will return 0. It’s useful for digit-based contracts such as Even/Odd, Matches/Differs, or Higher/Lower.'
        ),
    ],
};
