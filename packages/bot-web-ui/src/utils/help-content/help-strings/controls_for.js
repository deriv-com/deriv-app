import { localize } from '@deriv/translations';

export default {
    text: [
        localize(
            'This block uses the variable "i" to control the iterations. With each iteration, the value of "i" is determined by the items in a given list.'
        ),
        localize('Example:'),
        localize(
            '"i" starts with the value of 1, and it will be increased by 2 at every iteration. The loop will repeat until "i" reaches the value of 12, and then the loop is terminated.'
        ),
        localize('You can use "i" inside the loop, for example to access list items'),
    ],
};
