import React                  from 'react';
import { Button }             from 'deriv-components';
import { localize }           from 'App/i18n';
import Localize               from 'App/Components/Elements/localize.jsx';
import IconPoiPersonalDetails from 'Assets/AccountManagement/icon-poi-missing-details.svg';
import IconIdentityCard       from 'Assets/AccountManagement/icon-identity-card.svg';
import IconDrivingLicense     from 'Assets/AccountManagement/icon-driving-licence.svg';
import IconPassport           from 'Assets/AccountManagement/icon-passport.svg';
import IconPoiSubmitComplete  from 'Assets/AccountManagement/icon-poi-submit-complete.svg';
import IconPoiExpired         from 'Assets/AccountManagement/icon-poi-expired.svg';
import IconPoiVerified        from 'Assets/AccountManagement/icon-poi-verified.svg';
import IconMessageContent     from '../../../Components/icon-message-content.jsx';

const IconRow = () => (
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
        icon_row={<IconRow />}
    />
);

export const UploadComplete = ({ has_poa }) => {
    if (has_poa) {
        return (
            <IconMessageContent
                message={localize('Your proof of identity was submitted successfully')}
                text={localize('Your document is being reviewed, please check back in 1-3 days.')}
                icon={<IconPoiSubmitComplete />}
            >
                <Button
                    className='btn--primary'
                    type='button'
                    has_effect
                    onClick={() => {}}
                    text={localize('Continue trading')}
                />
            </IconMessageContent>
        );
    }
    return (
        <IconMessageContent
            message={localize('Your proof of identity was submitted successfully')}
            text={localize('Your document is being reviewed, please check back in 1-3 days. You must also submit a proof of address.')}
            icon={<IconPoiSubmitComplete />}
        >
            <Button
                className='btn--primary'
                type='button'
                has_effect
                onClick={() => {}}
                text={localize('Submit proof of address')}
            />
        </IconMessageContent>
    );
};

// TODO: check if this really matches unverified
// export const Unverified = () => (
//     <IconMessageContent
//         message={localize('We could not verify your proof of identity')}
//         text={localize('As a precaution, we have disabled trading, deposits and withdrawals for this account. If you have any questions, please go to our Help Centre.')}
//         icon={}
//     />
// );

export const Expired = () => (
    <IconMessageContent
        message={localize('New proof of identity document needed')}
        text={localize('Your proof of identity document has expired. You will need to submit a new one.')}
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
                <Button
                    className='btn--primary'
                    type='button'
                    has_effect
                    onClick={() => {}}
                    text={localize('Continue trading')}
                />
            </IconMessageContent>
        );
    }
    return (
        <IconMessageContent
            message={message}
            icon={<IconPoiVerified />}
            text={localize('To continue trading, you must also submit a proof of address.')}
        >
            <Button
                className='btn--primary'
                type='button'
                has_effect
                onClick={() => {}}
                text={localize('Submit proof of address')}
            />
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

