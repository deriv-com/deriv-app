import { Icon, Input } from '@deriv/components';
import { Localize } from '@deriv-com/translations';
import { DerivLightIcEmailSentPasskeyIcon } from '@deriv/quill-icons';
import { observer, useStore } from '@deriv/stores';
import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';

export const PasskeyRemoveWithEmail = observer(({ onBackButtonClick }: TPasskeysButtonOnClicks) => {
    const { client } = useStore();
    const { email_address } = client;

    return (
        <div className='passkeys'>
            <Icon
                data_testid='dt_learn_more_back_button'
                icon='IcBackButton'
                onClick={onBackButtonClick}
                className='passkeys-status__description-back-button'
            />
            <PasskeysStatusLayout
                className='passkeys-status__wrapper'
                icon={<DerivLightIcEmailSentPasskeyIcon height='96px' width='96px' className='passkey-status__icon' />}
                title={
                    <Localize
                        i18n_default_text='We’ve sent a verification code to {{email_address}}'
                        values={{ email_address }}
                    />
                }
            >
                <div className='passkeys-status__otp-code-container'>
                    <Input />
                    <span>Resend code in 59s</span>
                </div>
            </PasskeysStatusLayout>
        </div>
    );
});
