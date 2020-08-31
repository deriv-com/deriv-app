import { localize } from '@deriv/translations';

export default {
    text: [
        localize(
            'This block is used to determine if the market price moves in the selected direction or not. It gives you a value of "True" or "False".'
        ),
        localize('Examples:'),
        localize(
            '1. If the selected direction is "Rise", and the previous tick value is less than the current tick value, the output will be "True". Otherwise, the output will be an empty string.'
        ),
        localize(
            '2. If the selected direction is "Fall", and the previous tick value is more than the current tick value, the output will be "True". Otherwise, the output will be an empty string.'
        ),
    ],
};
