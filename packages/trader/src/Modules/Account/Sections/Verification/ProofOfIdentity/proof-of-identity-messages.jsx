import React from 'react';
import { Icon } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import ButtonLink from 'App/Components/Routes/button-link.jsx';
import IconMessageContent from '../../../Components/icon-message-content.jsx';

const ContinueTradingButton = () => (
    <ButtonLink to='/'>
        <p className='dc-btn__text'>{localize('Continue trading')}</p>
    </ButtonLink>
);

const PoaButton = () => (
    <ButtonLink to='/account/proof-of-address'>
        <p className='dc-btn__text'>{localize('Submit proof of address')}</p>
    </ButtonLink>
);

const GoToPersonalDetailsButton = () => (
    <ButtonLink to='/account/personal-details'>
        <p className='dc-btn__text'>{localize('Go to personal details')}</p>
    </ButtonLink>
);

export const Unsupported = () => {
    const UnsupportedIconRow = () => (
        <div className='poi-icon-row'>
            <div className='poi-icon-row__icon-container'>
                <Icon icon='IcIdentityCard' size={90} />
                <p>{localize('Identity card')}</p>
                <p>{localize('Front and back')}</p>
            </div>
            <div className='poi-icon-row__icon-container'>
                <Icon icon='IcDrivingLicense' size={90} />
                <p>{localize('Driving license')}</p>
                <p>{localize('Front and back')}</p>
            </div>
            <div className='poi-icon-row__icon-container'>
                <Icon icon='IcPassport' size={90} />
                <p>{localize('Passport')}</p>
                <p>{localize('Face photo page')}</p>
            </div>
        </div>
    );

    return (
        <IconMessageContent
            message={localize('Verify your identity')}
            text={
                <Localize
                    i18n_default_text='To continue trading with us, you need to email a copy of any one of these government-issued photo ID documents to <0>authentications@deriv.com</0>.'
                    components={[
                        <a
                            key={0}
                            className='link link--orange'
                            rel='noopener noreferrer'
                            target='_blank'
                            href='mailto:authentications@deriv.com'
                        />,
                    ]}
                />
            }
            icon_row={<UnsupportedIconRow />}
        />
    );
};

export const UploadComplete = ({ has_poa }) => {
    const message = localize('Your proof of identity was submitted successfully');
    if (has_poa) {
        return (
            <IconMessageContent
                message={message}
                text={localize('Your document is being reviewed, please check back in 1-3 days.')}
                icon={<Icon icon='IcPoiVerified' size={128} />}
            >
                <ContinueTradingButton />
            </IconMessageContent>
        );
    }
    return (
        <IconMessageContent message={message} icon={<Icon icon='IcPoiVerified' size={128} />}>
            <div className='account-management__text-container'>
                <p className='account-management__text'>
                    {localize('Your document is being reviewed, please check back in 1-3 days.')}
                </p>
                <p className='account-management__text'>{localize('You must also submit a proof of address.')}</p>
            </div>
            <PoaButton />
        </IconMessageContent>
    );
};

export const Unverified = () => (
    <IconMessageContent
        message={localize('We could not verify your proof of identity')}
        text={
            <Localize
                i18n_default_text='Please check your email for details.'
                // TODO: enable link to Help Center when POI help content is ready
                // i18n_default_text='Please check your email for details. If you have any questions, please go to our <0>Help Centre</0>.'
                // components={[
                //     <a key={0} className='link link--orange' rel='noopener noreferrer' target='_blank' href='https://www.deriv.com/help-centre/' />,
                // ]}
            />
        }
        icon={<Icon icon='IcPoiError' size={128} />}
    />
);

export const Expired = () => (
    <IconMessageContent
        message={localize('New proof of identity document needed')}
        text={
            <Localize
                i18n_default_text='Kindly send a scan of a valid proof of identity to <0>support@deriv.com</0>'
                components={[
                    <a
                        key={0}
                        className='link link--orange'
                        rel='noopener noreferrer'
                        target='_blank'
                        href='mailto:support@deriv.com'
                    />,
                ]}
            />
        }
        icon={<Icon icon='IcPoiUpload' size={128} />}
    />
);

export const Verified = ({ has_poa }) => {
    const message = localize('Your proof of identity is verified');
    if (has_poa) {
        return (
            <IconMessageContent message={message} icon={<Icon icon='IcPoiVerified' size={128} />}>
                <ContinueTradingButton />
            </IconMessageContent>
        );
    }
    return (
        <IconMessageContent
            message={message}
            icon={<Icon icon='IcPoiVerified' size={128} />}
            text={localize('To continue trading, you must also submit a proof of address.')}
        >
            <PoaButton />
        </IconMessageContent>
    );
};

export const MissingPersonalDetails = () => (
    <IconMessageContent
        message={localize('Your personal details are missing')}
        text={localize('Please complete your personal details before you verify your identity.')}
        icon={<Icon icon='IcAccountMissinglDetails' size={128} />}
    >
        <GoToPersonalDetailsButton />
    </IconMessageContent>
);

export const OnfidoFailed = () => (
    <IconMessageContent
        message={localize('Proof of identity verification failed')}
        text={localize(
            'We were unable to verify your document automatically. We will try to verify your document manually. Please check back in 1-3 days.'
        )}
        icon={<Icon icon='IcPoiFailed' size={128} />}
    />
);
