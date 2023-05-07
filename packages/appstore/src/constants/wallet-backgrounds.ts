export const getCashierWalletModalBackgrounds = (currency: string) => {
    let new_currency = currency;
    const is_demo = new_currency === 'demo';

    if (['eusdt', 'tusdt', 'ust'].includes(currency)) {
        new_currency = 'usdt';
    }

    return {
        color: `var(--wallets-modal-${is_demo ? 'demo-' : ''}base-background)`,
        primary: `var(--wallets-modal-${new_currency}-background-primary)`,
        secondary: `var(--wallets-modal-${new_currency}-background-secondary)`,
        tertiary: `var(--wallets-modal-${new_currency}-background-primary)`,
    };
};
