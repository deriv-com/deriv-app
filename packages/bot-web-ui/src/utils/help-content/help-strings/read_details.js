import { localize } from '@deriv/translations';

export default {
    text: [
        localize('This block gives you information about your last contract.'),
        localize('You can choose to see one of the following:'),
        localize('- Deal reference ID: the reference ID of the contract'),
        localize('- Purchase price: the purchase price (stake) of the contract'),
        localize('- Payout: the payout of the contract'),
        localize('- Profit: the profit you’ve earned'),
        localize('- Contract type: the name of the contract type such as Rise, Fall, Touch, No Touch, etс.'),
        localize('- Entry time: the starting time of the contract'),
        localize('- Entry value: the value of the first tick of the contract'),
        localize('- Exit time: the contract expiration time'),
        localize('- Exit value: the value of the last tick of the contract'),
        localize(
            '- Barrier: the barrier value of the contract (applicable to barrier-based trade types such as stays in/out, touch/no touch, etc.)'
        ),
        localize('- Result: the result of the last contract: "win" or "loss"'),
    ],
};
