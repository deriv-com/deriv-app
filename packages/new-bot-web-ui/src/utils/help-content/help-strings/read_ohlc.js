import { localize } from '@deriv/translations';

export default {
    text: [
        localize(
            'This block gives you the specified candle value for a selected time interval. You can choose which value you want:'
        ),
        localize('- Open: the opening price'),
        localize('- High: the highest price'),
        localize('- Low: the lowest price'),
        localize('- Close: the closing price'),
        localize('- Open time: the opening time stamp'),
        localize(
            'In the example below, the opening price is selected, which is then assigned to a variable called "op".'
        ),
    ],
};
