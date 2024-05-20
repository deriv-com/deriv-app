import { Analytics } from '@deriv-com/analytics';
import { getOSNameWithUAParser } from '@deriv/shared';
import { TServerError } from '../../../Types';
import { TSocketError } from '@deriv/api/types';
import { localize } from '@deriv/translations';
import * as Yup from 'yup';

export const PASSKEY_STATUS_CODES = {
    CREATED: 'created',
    LEARN_MORE: 'learn_more',
    LIST: '',
    NO_PASSKEY: 'no_passkey',
    REMOVED: 'removed',
    RENAMING: 'renaming',
    VERIFYING: 'verifying',
} as const;

export type TPasskeysStatus = typeof PASSKEY_STATUS_CODES[keyof typeof PASSKEY_STATUS_CODES];

export type TPasskeyError =
    | TServerError
    | null
    | TSocketError<'passkeys_list' | 'passkeys_register' | 'passkeys_register_options'>;

export const getPasskeyRenameValidationSchema = () =>
    Yup.object().shape({
        passkey_rename: Yup.string()
            .min(3, localize('Only 3-30 characters allowed.'))
            .max(30, localize('Only 3-30 characters allowed.'))
            .matches(/^[A-Za-z0-9][A-Za-z0-9\s-]*$/, localize('Only letters, numbers, space, and hyphen are allowed.')),
    });

export const passkeysMenuActionEventTrack = (
    action: string,
    additional_data: { error_message?: string; subform_name?: string } = {}
) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Analytics.trackEvent('ce_passkey_account_settings_form', {
        action,
        form_name: 'ce_passkey_account_settings_form',
        operating_system: getOSNameWithUAParser(),
        ...additional_data,
    });
};
