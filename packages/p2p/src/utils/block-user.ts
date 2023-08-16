import { isMobile } from '@deriv/shared';
import { localize } from 'Components/i18next';

export const getErrorMessage = (
    default_message: string,
    error_message_boolean: boolean,
    is_invalid_advertiser_id: boolean,
    name: string
) => {
    if (is_invalid_advertiser_id) {
        if (error_message_boolean) {
            return localize("Unblocking wasn't possible as {{name}} is not using Deriv P2P anymore.", {
                name,
            });
        }
        return localize("Blocking wasn't possible as {{name}} is not using Deriv P2P anymore.", {
            name,
        });
    }
    return default_message;
};

export const getErrorModalTitle = (is_invalid_advertiser_id: boolean, name: boolean) => {
    return is_invalid_advertiser_id
        ? localize('{{name}} is no longer on Deriv P2P', {
              name,
          })
        : localize('Unable to block advertiser');
};

export const getWidth = () => (isMobile() ? '90rem' : '40rem');
