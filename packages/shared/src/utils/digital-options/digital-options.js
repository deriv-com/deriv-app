import { localize } from '@deriv/translations';

export const showDigitalOptionsUnavailableError = (showError, platform_name) => {
    showError(
        localize(
            'We’re working to have this available for you soon. If you have another account, switch to that account to continue trading. You may add a DMT5 Financial.'
        ),
        localize('{{platform_name}} is not available for this account', {
            platform_name,
        }),
        localize('Go to DMT5 dashboard'),
        () => (window.location.href = `${location.protocol}//${location.hostname}/mt5`),
        false
    );
};
