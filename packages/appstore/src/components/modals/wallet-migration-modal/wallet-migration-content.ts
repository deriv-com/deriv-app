import { localize } from '@deriv-com/translations';

export const WalletMigrationContent = ({ is_eu = false }) => [
    {
        src: null,
        title: localize('New look. Same Deriv.'),
        description: localize(
            'A fresh interface to help you trade more confidently. Same account, same details, now with easier navigation.'
        ),
        buttonLabel: localize('Next'),
    },
    {
        src: is_eu ? '0588f724892cee294d997d78d0734e85' : 'e07d75d7aea82551a1e4792df4892780',
        title: localize('Explore the main tabs'),
        description: is_eu
            ? localize(
                  'Move seamlessly between the Home, CFDs, Options, and Wallets tabs. Track accounts, monitor positions, and manage your funds more strategically.'
              )
            : localize(
                  'Move seamlessly between the Home, CFDs, Multipliers, and Wallets tabs. Track accounts, monitor positions, and manage your funds more strategically.'
              ),
        buttonLabel: localize('Next'),
    },
    {
        src: is_eu ? 'f52c9eec89fc50299bab54efd67c92db' : 'd43289429afeac92c96edf28f85a36ce',
        title: localize('Smarter funds management'),
        description: localize(
            'Deposit and withdraw funds with ease. Transfer between Wallets and trading accounts whenever you need.'
        ),
        buttonLabel: localize('Try it now'),
    },
];
