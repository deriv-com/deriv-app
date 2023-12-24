import React from 'react';
import { isNavigationFromDerivGO, isNavigationFromP2P, routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { VerificationStatusActionButton } from '../../../Components/verification-status-action-button';
import { TAuthStatusCode } from '../../../Types/common.type';

export type TPoaStatus = Exclude<TAuthStatusCode, 'locked'>;

type TAuthParams = {
    needs_poi?: boolean;
    is_submitted?: boolean;
};

type TActionButtonProps = {
    onClick?: React.MouseEventHandler<HTMLElement>;
    platform_name?: string;
    auth_status?: TAuthParams;
    should_show_redirect_btn?: boolean;
    is_redirected_from_platform: boolean;
};

export const getFilesDescriptions = () => ({
    title: (
        <Localize i18n_default_text='We accept only these types of documents as proof of your address. The document must be recent (issued within last 6 months) and include your name and address:' />
    ),
    descriptions: [
        {
            key: 'utility_bill',
            value: <Localize i18n_default_text='Utility bill: electricity, water, gas, or landline phone bill.' />,
        },
        {
            key: 'financial_legal_government_document',
            value: (
                <Localize i18n_default_text='Financial, legal, or government document: recent bank statement, affidavit, or government-issued letter.' />
            ),
        },
        {
            key: 'home_rental_agreement',
            value: <Localize i18n_default_text='Home rental agreement: valid and current agreement.' />,
        },
    ],
});

const createPendingButton = ({
    auth_status,
    should_show_redirect_btn,
    is_redirected_from_platform,
    platform_name,
    onClick,
}: TActionButtonProps) => {
    if (!auth_status?.needs_poi) {
        if (should_show_redirect_btn)
            return (
                <VerificationStatusActionButton
                    button_text={<Localize i18n_default_text='Back to {{platform_name}}' values={{ platform_name }} />}
                    onClick={onClick}
                />
            );
        if (!is_redirected_from_platform) {
            return (
                <VerificationStatusActionButton
                    to={routes.root}
                    button_text={<Localize i18n_default_text='Continue trading' />}
                />
            );
        }
    }
    if (auth_status?.needs_poi) {
        return (
            <VerificationStatusActionButton
                to={routes.proof_of_identity}
                button_text={<Localize i18n_default_text='Proof of identity' />}
            />
        );
    }
    return null;
};

const createVerifiedButton = ({
    auth_status,
    should_show_redirect_btn,
    is_redirected_from_platform,
    platform_name,
    onClick,
}: TActionButtonProps) => {
    if (auth_status?.needs_poi) {
        return (
            <VerificationStatusActionButton
                to={routes.proof_of_identity}
                button_text={<Localize i18n_default_text='Proof of identity' />}
            />
        );
    }
    if (should_show_redirect_btn)
        return (
            <VerificationStatusActionButton
                button_text={<Localize i18n_default_text='Back to {{platform_name}}' values={{ platform_name }} />}
                onClick={onClick}
            />
        );
    if (!is_redirected_from_platform) {
        return (
            <VerificationStatusActionButton
                to={routes.root}
                button_text={<Localize i18n_default_text='Continue trading' />}
            />
        );
    }
    return null;
};

export const getPOAStatusMessages = (
    status: TPoaStatus,
    auth_status?: TAuthParams,
    should_show_redirect_btn?: boolean
) => {
    const is_redirected_from_platform = isNavigationFromP2P() || isNavigationFromDerivGO();

    const pendingButton = (props: Pick<TActionButtonProps, 'onClick' | 'platform_name'>) =>
        createPendingButton({
            ...props,
            auth_status,
            should_show_redirect_btn,
            is_redirected_from_platform,
        });

    const resubmitButton = ({ onClick }: Pick<TActionButtonProps, 'onClick'>) => (
        <VerificationStatusActionButton button_text={<Localize i18n_default_text='Resubmit' />} onClick={onClick} />
    );

    const verifiedButton = (props: Pick<TActionButtonProps, 'onClick' | 'platform_name'>) =>
        createVerifiedButton({ ...props, auth_status, should_show_redirect_btn, is_redirected_from_platform });

    const titles: Record<typeof status, React.ReactElement> = {
        expired: <Localize i18n_default_text='New proof of address is needed' />,
        none: <Localize i18n_default_text='Proof of address verification not required' />,
        pending: auth_status?.is_submitted ? (
            <Localize i18n_default_text='Your documents were submitted successfully' />
        ) : (
            <Localize i18n_default_text='Your proof of address was submitted successfully' />
        ),
        rejected: <Localize i18n_default_text='We could not verify your proof of address' />,
        suspected: <Localize i18n_default_text='We could not verify your proof of address' />,
        verified: <Localize i18n_default_text='Your proof of address is verified' />,
    };

    const descriptions: Record<typeof status, React.ReactElement | null> = {
        expired: <Localize i18n_default_text='Your documents for proof of address is expired. Please submit again.' />,
        none: (
            <Localize
                i18n_default_text='Your account does not need address verification at this time.<0/>We will inform you if address verification is required in the future.'
                components={[<br key={0} />]}
            />
        ),
        pending: (
            <div>
                {auth_status?.is_submitted ? (
                    <Localize i18n_default_text='We’ll review your documents and notify you of its status within 1 to 3 days.' />
                ) : (
                    <Localize i18n_default_text='Your document is being reviewed, please check back in 1-3 days.' />
                )}
                {auth_status?.needs_poi && (
                    <React.Fragment>
                        <br /> <Localize i18n_default_text='You must also submit a proof of identity.' />
                    </React.Fragment>
                )}
            </div>
        ),
        rejected: <Localize i18n_default_text='Please check your email for details.' />,
        suspected: <Localize i18n_default_text='Please check your email for details.' />,
        verified: auth_status?.needs_poi ? (
            <Localize i18n_default_text='To continue trading, you must also submit a proof of identity.' />
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

    const action_buttons: Record<
        typeof status,
        null | ((props: Pick<TActionButtonProps, 'onClick' | 'platform_name'>) => JSX.Element | null)
    > = {
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
