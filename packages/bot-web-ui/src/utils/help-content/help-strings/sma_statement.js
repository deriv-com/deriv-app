import { localize } from '@deriv/translations';

export default {
    text: [
        localize(
            'SMA adds the market price in a list of ticks or candles for a number of time periods, and divides the sum by that number of time periods.'
        ),
        localize('The formula for SMA is:'),
        localize('where n is the number of periods.'),
        '',
        localize('What SMA tells you'),
        localize(
            'SMA serves as an indicator of the trend. If the SMA points up then the market price is increasing and vice versa. The larger the period number, the smoother SMA line is.'
        ),
        localize(
            'In this example, each point of the SMA line is an arithmetic average of close prices for the last 10 days.'
        ),
        localize(
            'In this example, each point of the SMA line is an arithmetic average of close prices for the last 50 days.'
        ),
        '',
        localize('How to use the SMA block'),
        localize('Input list accepts a list of ticks or candles, while period is the specified time period.'),
        localize('Example:'),
        localize('This will display the SMA for the specified period, using a candle list.'),
        localize('SMA places equal weight to the entire distribution of values.'),
        localize('This is the same as the above example, using a tick list.'),
        localize(
            'You may compare SMA values calculated on every bot run to identify the market trend direction. Alternatively, you may also use a variation of the SMA block, the Simple Moving Average Array block. '
        ),
        localize('This block returns the entire SMA line, containing a list of all values for a given period.'),
        localize(
            'If a period of 10 is entered, the Simple Moving Average Array block will return a list of SMA values calculated based on period of 10.'
        ),
        localize('The below image illustrates how Simple Moving Average Array block works:'),
    ],
};
