import { DerivLightIcSuccessPasskeyIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';

import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';

export const PasskeyCreated = ({ onPrimaryButtonClick, onSecondaryButtonClick }: TPasskeysButtonOnClicks) => (
    <div className='passkeys'>
        <PasskeysStatusLayout
            description={
                <Localize
                    i18n_default_text='Your Deriv account is now protected with biometrics. To edit or remove your biometric data, press <0>Manage biometrics</0>.'
                    components={[<strong key={0} />]}
                />
            }
            icon={<DerivLightIcSuccessPasskeyIcon height='96px' width='96px' />}
            title={<Localize i18n_default_text='Success' />}
            onPrimaryButtonClick={onPrimaryButtonClick}
            onSecondaryButtonClick={onSecondaryButtonClick}
            primary_button_text={<Localize i18n_default_text="Go to Trader's Hub" />}
            secondary_button_text={<Localize i18n_default_text='Manage biometrics' />}
        />
    </div>
);
