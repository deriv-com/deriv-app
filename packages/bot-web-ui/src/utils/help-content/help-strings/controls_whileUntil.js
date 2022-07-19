import { localize } from '@deriv/translations';

export default {
    text: [
        localize('This block repeats instructions as long as a given condition is true.'),
        localize('Examples:'),
        localize(
            '1. In the example below, the instructions are repeated as long as the value of x is less than or equal to 10. Once the value of x exceeds 10, the loop is terminated.'
        ),
        localize(
            '2. In this example, the instructions are repeated as long as the value of x is greater than or equal to 10. Once the value of x drops below 10, the loop is terminated.'
        ),
    ],
};
