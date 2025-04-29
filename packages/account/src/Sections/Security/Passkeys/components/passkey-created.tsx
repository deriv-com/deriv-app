import { Icon } from '@deriv/components';
import { Localize } from '@deriv-com/translations';

import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';

export const PasskeyCreated = ({ onPrimaryButtonClick, onSecondaryButtonClick }: TPasskeysButtonOnClicks) => (
    <div className='passkeys'>
        <PasskeysStatusLayout
            description={<Localize i18n_default_text='You can use biometrics to log in to your Deriv account.' />}
            icon={<Icon icon='IcAccountCreatedBiometrics' size={96} />}
            title={<Localize i18n_default_text='Success' />}
            onPrimaryButtonClick={onPrimaryButtonClick}
            onSecondaryButtonClick={onSecondaryButtonClick}
            primary_button_text={<Localize i18n_default_text="Go to Trader's Hub" />}
            secondary_button_text={<Localize i18n_default_text='Manage biometrics' />}
        />
    </div>
);
