import { localize } from '@deriv/translations';

export default {
    text: [
        localize(
            "This block is mandatory. It's added to your strategy by default when you create new strategy. You can not add more than one copy of this block to the canvas."
        ),
        localize('1. Market'),
        localize('Select your desired market and asset type. For example, Forex > Major pairs > AUD/JPY'),
        localize('2. Trade Type'),
        localize('Select your desired trade type. For example, Up/Down > Rise/Fall'),
        localize('3. Contract Type'),
        localize(
            'Choose what type of contract you want to trade. For example, for the Rise/Fall trade type you can choose one of three options: Rise, Fall, or Both. Selected option will determine available options for the Purchase block.'
        ),
        localize('4. Default Candle Interval'),
        localize('Sets the default time interval for blocks that read list of candles.'),
        localize('5. Restart buy/sell on error'),
        localize('Restarts the bot when an error is encountered.'),
        localize('6. Restart last trade on error'),
        localize('Repeats the previous trade when an error is encountered.'),
        localize('7. Run Once at Start'),
        localize('Place blocks here to perform tasks once when your bot starts running.'),
        localize('8. Trade Options'),
        localize('The desired duration, stake, prediction, and/or barrier(s) for the contract is defined here.'),
    ],
};
