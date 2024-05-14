import { localize } from '@deriv/translations';

export default {
    text: [
        localize(
            'Any blocks placed within this block will be executed at every tick. If the default candle interval is set to 1 minute in the Trade Parameters root block, the instructions in this block will be executed once every minute. Place this block outside of any root block.'
        ),
    ],
};
