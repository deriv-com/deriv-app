import React from 'react';
import { Localize } from '@deriv/translations';
import { VerificationStatusActionButton } from 'Components/verification-status-action-button';
import { TAuthStatusCode } from '../../../Types/common.type';

export type TPooStatus = Exclude<TAuthStatusCode, 'locked' | 'expired' | 'suspected'>;

export const getPOOStatusMessages = (status: TPooStatus) => {
    const resubmitButton = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLElement> }) => (
        <VerificationStatusActionButton button_text={<Localize i18n_default_text='Try again' />} onClick={onClick} />
    );

    const titles: Record<typeof status, React.ReactElement> = {
        none: <Localize i18n_default_text="Your proof of ownership isn't required." />,
        pending: <Localize i18n_default_text='We’ve received your proof of ownership.' />,
        rejected: <Localize i18n_default_text='Proof of ownership verification failed' />,
        verified: <Localize i18n_default_text='Proof of ownership verification passed.' />,
    };

    const descriptions: Record<typeof status, React.ReactElement | null> = {
        none: (
            <Localize i18n_default_text='You are not required to submit proof of ownership at this time. We will inform you if proof of ownership is required in the future.' />
        ),
        pending: (
            <Localize i18n_default_text='We’ll review your documents and notify you of its status within 3 days.' />
        ),
        rejected: <Localize i18n_default_text='We were unable to verify your proof of ownership.' />,
        verified: null,
    };

    const icons: Record<typeof status, string> = {
        none: 'IcPooVerified',
        pending: 'IcPooSubmitted',
        rejected: 'IcPooRejected',
        verified: 'IcPooVerified',
    };

    const action_buttons: Record<
        typeof status,
        null | ((props: { onClick?: React.MouseEventHandler<HTMLElement> }) => JSX.Element | null)
    > = {
        none: null,
        pending: null,
        rejected: resubmitButton,
        verified: null,
    };

    return {
        title: titles[status],
        description: descriptions[status],
        icon: icons[status],
        action_button: action_buttons[status],
    };
};
