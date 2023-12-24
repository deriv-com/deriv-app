import React from 'react';
import { AUTH_STATUS_CODES, isNavigationFromDerivGO, isNavigationFromP2P } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { PoiButton } from '../../../Components/poi/poi-button/poi-button';
import { ContinueTradingButton } from '../../../Components/poa/continue-trading-button/continue-trading-button';
import styles from 'Components/verification-status/verifications-status.module.scss';
import { Button, Text } from '@deriv/components';
import { RedirectButton } from 'Components/redirect-button';

export const getPOAStatusMessages = (
    status: typeof AUTH_STATUS_CODES[keyof typeof AUTH_STATUS_CODES],
    needs_poi: boolean,
    should_show_redirect_btn?: boolean
) => {
    const is_redirected_from_platform = isNavigationFromP2P() || isNavigationFromDerivGO();

    const resubmitButton = (onClick?: () => void) => (
        <Button onClick={onClick} has_effect primary className={styles.action_button}>
            <Text size='xs' weight='bold' as='p' color='general' className={styles.action_button__text}>
                <Localize i18n_default_text={'Resubmit'} />
            </Text>
        </Button>
    );

    const pendingButton = () => {
        if (!needs_poi) {
            if (should_show_redirect_btn) return <RedirectButton />;
            if (!is_redirected_from_platform) return <ContinueTradingButton />;
        }
        if (needs_poi) return <PoiButton />;
        return null;
    };

    const verifiedButton = () => {
        if (needs_poi) return <PoiButton />;
        if (should_show_redirect_btn) return <RedirectButton />;
        if (!is_redirected_from_platform) return <ContinueTradingButton />;
        return null;
    };

    const titles: Record<typeof status, React.ReactElement> = {
        expired: <Localize i18n_default_text={'New proof of address is needed'} />,
        none: <Localize i18n_default_text={'Proof of address verification not required'} />,
        pending: <Localize i18n_default_text={'Your proof of address was submitted successfully'} />,
        rejected: <Localize i18n_default_text={'We could not verify your proof of address'} />,
        suspected: <Localize i18n_default_text={'We could not verify your proof of address'} />,
        verified: <Localize i18n_default_text={'Your proof of address is verified'} />,
    };

    const descriptions: Record<typeof status, React.ReactElement | null> = {
        expired: (
            <Localize i18n_default_text={'Your documents for proof of address is expired. Please submit again.'} />
        ),
        none: (
            <Localize
                i18n_default_text={
                    'Your account does not need address verification at this time. We will inform you if address verification is required in the future.'
                }
            />
        ),
        pending: (
            <div>
                <Localize i18n_default_text={'Your document is being reviewed, please check back in 1-3 days.'} />
                {needs_poi && (
                    <>
                        <br /> <Localize i18n_default_text={'You must also submit a proof of identity.'} />
                    </>
                )}
            </div>
        ),
        rejected: <Localize i18n_default_text={'Please check your email for details.'} />,
        suspected: <Localize i18n_default_text={'Please check your email for details.'} />,
        verified: needs_poi ? (
            <Localize i18n_default_text={'To continue trading, you must also submit a proof of identity.'} />
        ) : null,
    };

    const icons: Record<typeof status, string> = {
        expired: 'IcPoaUpload',
        none: 'IcPoaVerified',
        pending: 'IcPoaVerified',
        rejected: 'IcPoaError',
        suspected: 'IcPoaError',
        verified: 'IcPoaVerified',
    };

    const action_buttons: Record<typeof status, null | ((onClick?: () => void) => JSX.Element | null)> = {
        expired: resubmitButton,
        none: null,
        pending: pendingButton,
        rejected: resubmitButton,
        suspected: resubmitButton,
        verified: verifiedButton,
    };

    return {
        title: titles[status],
        description: descriptions[status],
        icon: icons[status],
        action_button: action_buttons[status],
    };
};
