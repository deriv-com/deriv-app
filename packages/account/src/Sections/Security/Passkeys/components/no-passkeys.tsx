import { DerivLightIcAddPasskeyIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';

import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';

export const NoPasskeys = ({ onPrimaryButtonClick, onSecondaryButtonClick }: TPasskeysButtonOnClicks) => (
    <div className='passkeys'>
        <PasskeysStatusLayout
            description={
                <Localize i18n_default_text='Use fingerprint, face recognition, or other biometric data to log in easily and securely.' />
            }
            icon={<DerivLightIcAddPasskeyIcon height='96px' width='96px' />}
            title={<Localize i18n_default_text='Your key to safer logins' />}
            onPrimaryButtonClick={onPrimaryButtonClick}
            onSecondaryButtonClick={onSecondaryButtonClick}
            primary_button_text={<Localize i18n_default_text='Enable biometrics' />}
            secondary_button_text={<Localize i18n_default_text='Learn more' />}
        />
    </div>
);
