import { localize } from '@deriv/translations';

export default {
    text: [
        localize(
            'This block uses the variable "i" to control the iterations. With each iteration, the value of "i" is determined by the items in a given list.'
        ),
        localize('Example:'),
        localize(
            'In this example, the loop will repeat three times, as that is the number of items in the given list. During each iteration, the variable "i" will be assigned a value from the list. '
        ),
        localize('Please note that changing the value of "i" won\'t change the value of the original item in the list'),
    ],
};
