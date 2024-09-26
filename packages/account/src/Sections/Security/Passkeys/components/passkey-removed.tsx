import { Localize } from '@deriv-com/translations';
import { getOSNameWithUAParser } from '@deriv/shared';
import { DerivLightIcSuccessPasskeyIcon } from '@deriv/quill-icons';
import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';

const getPasskeysRemovedDescription = (os: ReturnType<typeof getOSNameWithUAParser>) => {
    if (os === 'iOS' || os === 'Mac OS') {
        return (
            <Localize i18n_default_text='Your passkey is successfully removed. To avoid sign-in prompts, also remove the passkey from your iCloud keychain.' />
        );
    }
    return (
        <Localize i18n_default_text='Your passkey is successfully removed. To avoid sign-in prompts, also remove the passkey from your Google password manager.' />
    );
};

export const PasskeyRemoved = ({ onPrimaryButtonClick }: TPasskeysButtonOnClicks) => (
    <div className='passkeys'>
        <PasskeysStatusLayout
            description={getPasskeysRemovedDescription(getOSNameWithUAParser())}
            icon={<DerivLightIcSuccessPasskeyIcon height='96px' width='96px' />}
            title={<Localize i18n_default_text='Passkey successfully removed' />}
            onPrimaryButtonClick={onPrimaryButtonClick}
            primary_button_text={<Localize i18n_default_text='Continue' />}
        />
    </div>
);
