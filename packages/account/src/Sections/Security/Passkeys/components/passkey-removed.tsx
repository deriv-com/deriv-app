import { DerivLightIcSuccessPasskeyIcon } from '@deriv/quill-icons';
import { getOSNameWithUAParser } from '@deriv/shared';
import { Localize } from '@deriv-com/translations';

import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';

const getPasskeysRemovedDescription = (os: ReturnType<typeof getOSNameWithUAParser>) => {
    if (os === 'iOS' || os === 'Mac OS') {
        return (
            <Localize i18n_default_text='This biometric can’t be used anymore. To stop sign-in prompts, delete it from your iCloud Keychain.' />
        );
    }
    return (
        <Localize i18n_default_text='This biometric can’t be used anymore. To stop sign-in prompts, make sure to delete it from your password manager too.' />
    );
};

export const PasskeyRemoved = ({ onPrimaryButtonClick }: TPasskeysButtonOnClicks) => (
    <div className='passkeys'>
        <PasskeysStatusLayout
            description={getPasskeysRemovedDescription(getOSNameWithUAParser())}
            icon={<DerivLightIcSuccessPasskeyIcon height='96px' width='96px' />}
            title={<Localize i18n_default_text='Biometric removed' />}
            onPrimaryButtonClick={onPrimaryButtonClick}
            primary_button_text={<Localize i18n_default_text='OK' />}
        />
    </div>
);
