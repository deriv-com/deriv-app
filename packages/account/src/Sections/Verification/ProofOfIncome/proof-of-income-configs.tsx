import { Localize, localize } from '@deriv/translations';
import React from 'react';
import { VerificationStatusActionButton } from 'Components/verification-status-action-button';
import { TAuthStatusCode } from '../../../Types/common.type';

export type TPoincStatus = Exclude<TAuthStatusCode, 'suspected' | 'expired'>;

export const getPoincDocumentsList = () =>
    [
        { text: localize('Tax return'), value: 'tax_return' },
        { text: localize('Employment contract'), value: 'employment_contract' },
        { text: localize('Payslip'), value: 'payslip' },
        { text: localize('Certificate of incorporation'), value: 'coi' },
        { text: localize('Business proof of address'), value: 'business_poa' },
        { text: localize('Article of association'), value: 'article_of_association' },
        { text: localize('Memorandum'), value: 'memorandum' },
        { text: localize('Authorization letter'), value: 'authorisation_letter' },
        { text: localize('Declarations'), value: 'declarations' },
    ] as const;

export const getPOOINCStatusMessages = (status: TPoincStatus) => {
    const resubmitButton = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLElement> }) => (
        <VerificationStatusActionButton button_text={<Localize i18n_default_text='Try again' />} onClick={onClick} />
    );

    const titles: Record<typeof status, React.ReactElement | null> = {
        locked: <Localize i18n_default_text='Limit reached' />,
        none: null,
        pending: <Localize i18n_default_text="We've received your proof of income" />,
        rejected: <Localize i18n_default_text='Income verification failed' />,
        verified: <Localize i18n_default_text='Proof of income verification passed' />,
    };

    const descriptions: Record<typeof status, React.ReactElement | null> = {
        locked: (
            <Localize
                i18n_default_text="You have reached the maximum number of allowed attempts for submitting proof of income. <0 /> Please check the email we've sent you for further information."
                components={[<br key={0} />]}
            />
        ),
        none: null,
        pending: (
            <Localize i18n_default_text="We'll review your documents and notify you of its status within 7 working days." />
        ),
        rejected: (
            <Localize
                i18n_default_text="We were unable to verify your income. <0 /> Please check the email we've sent you for further information."
                components={[<br key={0} />]}
            />
        ),
        verified: null,
    };

    const icons: Record<typeof status, string> = {
        locked: 'IcPoincLimited',
        none: '',
        pending: 'IcPoincReceived',
        rejected: 'IcPoincFailed',
        verified: 'IcPoincVerified',
    };

    const action_buttons: Record<
        typeof status,
        null | ((props: { onClick?: React.MouseEventHandler<HTMLElement> }) => JSX.Element | null)
    > = {
        locked: null,
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
