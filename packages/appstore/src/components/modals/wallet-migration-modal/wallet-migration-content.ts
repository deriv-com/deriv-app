import { localize } from '@deriv-com/translations';

export const WalletMigrationContent = ({ is_eu = false, is_mobile = false }) => {
    const getSrcValues = () => ({
        explore_tabs: {
            mobile: {
                eu: '0588f724892cee294d997d78d0734e85',
                row: 'd43289429afeac92c96edf28f85a36ce',
            },
            desktop: {
                eu: '52d40ccffb2740504da5ba26cd2463cb',
                row: 'bca66927ff765bccac3293e3f56b68ca',
            },
        },
        funds_management: {
            mobile: {
                eu: 'f52c9eec89fc50299bab54efd67c92db',
                row: 'e07d75d7aea82551a1e4792df4892780',
            },
            desktop: {
                eu: 'f77b467a91718d094f7daa4426f40ce7',
                row: '2ad9de8022515942c8cce14b87e27ee2',
            },
        },
    });

    const src_values = getSrcValues();
    const device = is_mobile ? 'mobile' : 'desktop';
    const region = is_eu ? 'eu' : 'row';

    return [
        {
            src: null,
            title: localize('New look. Same Deriv.'),
            description: localize(
                'A fresh interface to help you trade more confidently. Same account, same details, now with easier navigation.'
            ),
            buttonLabel: localize('Next'),
        },
        {
            src: src_values.explore_tabs[device][region],
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
            src: src_values.funds_management[device][region],
            title: localize('Smarter funds management'),
            description: localize(
                'Deposit and withdraw funds with ease. Transfer between Wallets and trading accounts whenever you need.'
            ),
            buttonLabel: localize('Try it now'),
        },
    ];
};
