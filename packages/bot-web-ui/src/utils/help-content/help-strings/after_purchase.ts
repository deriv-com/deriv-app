import { localize } from '@deriv/translations';

export default {
    text: [
        localize(
            'This block is mandatory. Here is where you can decide if your bot should continue trading. Only one copy of this block is allowed.'
        ),
        localize(
            'This block is commonly used to adjust the parameters of your next trade and to implement stop loss/take profit logic.'
        ),
    ],
};
