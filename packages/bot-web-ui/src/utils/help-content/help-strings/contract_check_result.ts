import { localize } from '@deriv/translations';

export default {
    text: [
        localize(
            'You can check the result of the last trade with this block. It can only be placed within the "Restart trading conditions" root block.'
        ),
        localize(
            'If "Win" is selected, it will return "True" if your last trade was successful. Otherwise, it will return an empty string.'
        ),
        localize(
            'If "Loss" is selected, it will return "True" if your last trade was unsuccessful. Otherwise, it will return an empty string.'
        ),
        localize('Example:'),
    ],
};
