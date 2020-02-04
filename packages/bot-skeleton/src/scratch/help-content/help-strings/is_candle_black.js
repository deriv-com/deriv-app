import { localize } from '@deriv/translations';

export default {
    text: [
        localize(
            'This block returns "True" if the last candle is black. It can be placed anywhere on the canvas except within the Trade parameters root block.'
        ),
        localize(
            'The term "candle" refers to each bar on the candlestick chart. Each candle represents four market prices for the selected time interval:'
        ),
        localize('Each candlestick on the chart represents 4 market prices for the selected time interval:'),
        localize('- Open price: the opening price'),
        localize('- High price: the highest price'),
        localize('- Low price: the lowest price'),
        localize('- Close price: the closing price'),
        localize(
            'A black (or red) candle indicates that the open price is higher than the close price. This represents a downward movement of the market price.'
        ),
        localize(
            'A white (or green) candle indicates that the open price is lower than the close price. This represents an upward movement of the market price.'
        ),
        localize('The time interval for each candle can be set from one minute to one day.'),
    ],
};
