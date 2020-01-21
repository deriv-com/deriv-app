import { localize } from '@deriv/translations';

export default {
    text: [
        localize('"Seconds Since Epoch" block returns the number of seconds since January 1st, 1970.'),
        localize('Example:'),
        localize('1551661986 seconds since Jan 01 1970 (UTC) translates to 03/04/2019 @ 1:13am (UTC).'),
        localize('You might need it when you want to repeat an actions after certain amount of time.'),
        localize('The example below restarts trading after 30 or more seconds after 1 minute candle was started.'),
    ],
};
