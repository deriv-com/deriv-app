import { redirectToSignUp, mobileOSDetectAsync, isSafari } from '@deriv/shared';
import { useGrowthbookGetFeatureValue } from '@deriv/hooks';

export const useSignupTrigger = () => {
    const [trigger_os_signup] = useGrowthbookGetFeatureValue({
        featureFlag: 'trigger_os_signup',
        defaultValue: false,
    });

    const handleOutSystemsRedirection = () => {
        switch (process.env.NODE_ENV) {
            case 'production':
                return 'https://hub.deriv.com/tradershub/signup';
            case 'staging':
                return 'https://staging-hub.deriv.com/tradershub/signup';
            default:
                return 'https://dev-hub.deriv.com/tradershub/signup';
        }
    };

    const handleSignup = async () => {
        const os = await mobileOSDetectAsync();

        if (trigger_os_signup) {
            if (os === 'iOS' || isSafari()) {
                redirectToSignUp();
            } else window.open(handleOutSystemsRedirection());
        } else redirectToSignUp();
    };

    return { handleSignup };
};
