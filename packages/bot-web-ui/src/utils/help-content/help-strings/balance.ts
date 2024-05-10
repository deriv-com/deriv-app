import { localize } from '@deriv/translations';

export default {
    text: [
        localize('This block returns current account balance.'),
        localize(
            'The only input parameter determines how block output is going to be formatted. In case if the input parameter is "string" then the account currency will be added.'
        ),
        localize('Example output of the below example will be:'),
        localize('1. for "string": 1325.68 USD'),
        localize('2. for "number": 1325.68'),
    ],
};
