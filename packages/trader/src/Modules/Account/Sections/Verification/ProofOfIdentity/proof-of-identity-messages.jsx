import React                  from 'react';
import ButtonLink             from 'App/Components/Routes/button-link.jsx';
import { localize }           from 'App/i18n';
import Localize               from 'App/Components/Elements/localize.jsx';
import IconPoiPersonalDetails from 'Assets/AccountManagement/icon-poi-missing-details.svg';
import IconIdentityCard       from 'Assets/AccountManagement/icon-identity-card.svg';
import IconDrivingLicense     from 'Assets/AccountManagement/icon-driving-licence.svg';
import IconPassport           from 'Assets/AccountManagement/icon-passport.svg';
import IconPoiSubmitComplete  from 'Assets/AccountManagement/icon-poi-submit-complete.svg';
import IconPoiExpired         from 'Assets/AccountManagement/icon-poi-is-expired.svg';
import IconPoiVerified        from 'Assets/AccountManagement/icon-poi-verified.svg';
import IconPoiUnverified      from 'Assets/AccountManagement/icon-poi-unverified.svg';
import IconMessageContent     from '../../../Components/icon-message-content.jsx';

const UnsupportedIconRow = () => (
    <div className='poi-icon-row'>
        <div className='poi-icon-row__icon-container'>
            <IconIdentityCard />
            <p>{localize('Identity card')}</p>
            <p>{localize('Front and back')}</p>
        </div>
        <div className='poi-icon-row__icon-container'>
            <IconDrivingLicense />
            <p>{localize('Driving license')}</p>
            <p>{localize('Front and back')}</p>
        </div>
        <div className='poi-icon-row__icon-container'>
            <IconPassport />
            <p>{localize('Passport')}</p>
            <p>{localize('Face photo page')}</p>
        </div>
    </div>
);

const ContinueTradingButton = () => (
    <ButtonLink
        className='btn--primary'
        to='/'
    >
        {localize('Continue trading')}
    </ButtonLink>
);

const PoaButton = () => (
    <ButtonLink
        className='btn--primary btn__text'
        to='/account/proof-of-address'
    >
        {localize('Submit proof of address')}
    </ButtonLink>
);

export const Unsuported = () => (
    <IconMessageContent
        message={localize('Verify your identity')}
        text={
            <Localize
                i18n_default_text='To continue trading with us, you need to email a copy of any one of these government-issued photo ID documents to <0>authentications@deriv.com</0>.'
                components={[
                    <a key={0} className='link link--orange' rel='noopener noreferrer' target='_blank' href='mailto:authentications@deriv.com' />,
                ]}
            />}
        icon_row={<UnsupportedIconRow />}
    />
);

export const UploadComplete = ({ has_poa }) => {
    const message = localize('Your proof of identity was submitted successfully');
    if (has_poa) {
        return (
            <IconMessageContent
                message={message}
                text={localize('Your document is being reviewed, please check back in 1-3 days.')}
                icon={<IconPoiSubmitComplete />}
            >
                <ContinueTradingButton />
            </IconMessageContent>
        );
    }
    return (
        <IconMessageContent
            message={message}
            text={localize('Your document is being reviewed, please check back in 1-3 days. You must also submit a proof of address.')}
            icon={<IconPoiSubmitComplete />}
        >
            <PoaButton />
        </IconMessageContent>
    );
};

export const Unverified = () => (
    <IconMessageContent
        message={localize('We could not verify your proof of identity')}
        text={localize('As a precaution, we have disabled trading, deposits and withdrawals for this account. If you have any questions, please go to our Help Centre.')}
        icon={<IconPoiUnverified />}
    />
);

export const Expired = () => (
    <IconMessageContent
        message={localize('New proof of identity document needed')}
        text={
            <Localize
                i18n_default_text='Kindly send a scan of a valid proof of identity to <0>support@deriv.com</0>'
                components={[
                    <a key={0} className='link link--orange' rel='noopener noreferrer' target='_blank' href='mailto:support@deriv.com' />,
                ]}
            />}
        icon={<IconPoiExpired />}
    />
);

export const Verified = ({ has_poa }) => {
    const message = localize('Your proof of identity is verified');
    if (has_poa) {
        return (
            <IconMessageContent
                message={message}
                icon={<IconPoiVerified />}
            >
                <ContinueTradingButton />
            </IconMessageContent>
        );
    }
    return (
        <IconMessageContent
            message={message}
            icon={<IconPoiVerified />}
            text={localize('To continue trading, you must also submit a proof of address.')}
        >
            <PoaButton />
        </IconMessageContent>
    );
};

// TODO: check when this happens
export const MissingPersonalDetails = () => (
    <IconMessageContent
        message={localize('Your personal details are missing')}
        text={localize('Please complete your personal details before you verify your identity.')}
        icon={<IconPoiPersonalDetails />}
    />
);

