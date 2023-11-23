import React from 'react';
import { Analytics, TEvents } from '@deriv/analytics';
import { useStore } from '@deriv/stores';
import { removeNullOrUndefinedValues } from '@deriv/shared';

export type TTrackRealAccountSignup = Omit<
    TEvents['ce_real_account_signup_form'],
    'landing_company' | 'user_choice'
> & {
    user_choice?: string | object;
};

const useAnalytics = () => {
    const { ui, client } = useStore();
    const { is_mobile, real_account_signup_target } = ui;

    React.useEffect(() => {
        client?.loginid &&
            Analytics.setAttributes({
                device_type: is_mobile ? 'mobile' : 'desktop',
                account_type: client?.loginid?.slice(0, 2),
            });
    }, [is_mobile, client?.loginid]);

    const trackRealAccountSignup = React.useCallback(
        ({
            action,
            step_codename,
            step_num,
            user_choice,
            real_signup_error_message,
            form_source,
        }: TTrackRealAccountSignup) => {
            if (real_account_signup_target === 'maltainvest') return;

            const payload: TEvents['ce_real_account_signup_form'] = {
                action,
                step_codename,
                step_num,
                user_choice: JSON.stringify(user_choice),
                form_source: form_source ?? window?.location?.href,
                form_name: 'real_account_signup_form',
                real_signup_error_message: JSON.stringify(real_signup_error_message),
                landing_company: real_account_signup_target,
            };
            Analytics?.trackEvent('ce_real_account_signup_form', removeNullOrUndefinedValues(payload));
        },
        [real_account_signup_target]
    );

    return { trackRealAccountSignup };
};

export default useAnalytics;
