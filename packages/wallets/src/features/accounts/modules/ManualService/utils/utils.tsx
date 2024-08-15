import React from 'react';
import ClearPhoto from '../../../../../public/images/accounts/clear-photo.svg';
import ClockIcon from '../../../../../public/images/accounts/clock-icon.svg';
import DrivingLicenseIcon from '../../../../../public/images/accounts/driving-license.svg';
import IdentityCardIcon from '../../../../../public/images/accounts/identity-card.svg';
import ImageIcon from '../../../../../public/images/accounts/image-icon.svg';
import LessThanEightIcon from '../../../../../public/images/accounts/less-than-eight-icon.svg';
import NIMCSlipIcon from '../../../../../public/images/accounts/nimc-slip.svg';
import PassportIcon from '../../../../../public/images/accounts/passport.svg';
import { THooks, TTranslations } from '../../../../../types';
import { DrivingLicenseUpload, IdentityCardUpload, NIMCSlipUpload, PassportUpload } from '../components';

type TManualDocumentComponentProps = {
    // eslint-disable-next-line lines-around-comment
    /** clients country code which is required to be passed during document upload */
    documentIssuingCountryCode?: THooks.AccountSettings['country_code'];

    /** used to go back to the manual document selection page from the document upload page */
    onClickBack?: VoidFunction;

    /** callback to be called after successful completion of manual document upload */
    onCompletion?: VoidFunction;
};

export type TManualDocumentComponent = React.FC<TManualDocumentComponentProps>;

export type TManualDocumentType = Record<
    string,
    {
        component: TManualDocumentComponent;
        countries?: string[];
        description: string;
        icon: React.ComponentType<React.SVGAttributes<SVGElement>>;
        title: string;
    }
>;

export type TDocumentRule = {
    description: string;
    icon: JSX.Element;
};

type TGetManualDocumentsMapper = {
    [k: string]: TManualDocumentType[number];
};

/** A mapper which contains the info on all the available manual POI upload options for a client */
export const getManualDocumentsMapper = (localize: TTranslations['localize']) =>
    ({
        passport: {
            component: PassportUpload,
            description: localize('Upload the page that contains your photo.'),
            icon: PassportIcon,
            title: localize('Passport'),
        },
        // eslint-disable-next-line sort-keys
        'driving-license': {
            component: DrivingLicenseUpload,
            description: localize('Upload the front and back of your driving licence.'),
            icon: DrivingLicenseIcon,
            title: localize('Driving licence'),
        },
        'identity-card': {
            component: IdentityCardUpload,
            description: localize('Upload the front and back of your identity card.'),
            icon: IdentityCardIcon,
            title: localize('Identity card'),
        },
        'nimc-slip': {
            component: NIMCSlipUpload,
            countries: ['ng'],
            description: localize('Upload the front and back of your identity card.'),
            icon: NIMCSlipIcon,
            title: localize('NIMC slip and proof of age'),
        },
    } as TGetManualDocumentsMapper);

const getDocumentRules = (localize: TTranslations['localize']) =>
    [
        {
            description: localize('Must be valid for at least 6 months'),
            icon: <ClockIcon />,
        },
        {
            description: localize('A clear colour photo or scanned image'),
            icon: <ClearPhoto />,
        },
        {
            description: localize('JPEG, JPG, PNG, PDF, or GIF'),
            icon: <ImageIcon />,
        },
        {
            description: localize('Less than 8MB'),
            icon: <LessThanEightIcon />,
        },
    ] as TDocumentRule[];

/** Special rules to show as hints for NIMC countries */
export const getNIMCDocumentRules = (localize: TTranslations['localize']) => getDocumentRules(localize).slice(1);

/** General rules to show as hints for non-NIMC countries */
export const getGeneralDocumentRules = (localize: TTranslations['localize']) => getDocumentRules(localize);
