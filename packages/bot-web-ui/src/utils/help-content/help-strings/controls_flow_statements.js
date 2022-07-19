import { localize } from '@deriv/translations';

export default {
    text: [
        localize(
            'This block is used to either terminate or continue a loop, and can be placed anywhere within a loop block.'
        ),
        localize('Examples:'),
        localize(
            '1. In the below example the loop is terminated in case "x" is "False" even though only one iteration is complete'
        ),
        localize(
            '2. In the below example the loop jumps to the next iteration without executing below block in case if "x" is "False"'
        ),
    ],
};
