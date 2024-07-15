import React from 'react';
import ClearPhoto from '../../../../../public/images/accounts/clear-photo.svg';
import ClockIcon from '../../../../../public/images/accounts/clock-icon.svg';
import DrivingLicenseIcon from '../../../../../public/images/accounts/driving-license.svg';
import IdentityCardIcon from '../../../../../public/images/accounts/identity-card.svg';
import ImageIcon from '../../../../../public/images/accounts/image-icon.svg';
import LessThanEightIcon from '../../../../../public/images/accounts/less-than-eight-icon.svg';
import NIMCSlipIcon from '../../../../../public/images/accounts/nimc-slip.svg';
import PassportIcon from '../../../../../public/images/accounts/passport.svg';
import { PassportUpload } from '../components';

type TManualDocumentComponentProps = {
    onCompletion?: () => void;
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
    icon: React.ComponentType<React.SVGAttributes<SVGElement>>;
};

export const manualDocumentsMapper: TManualDocumentType = {
    passport: {
        component: PassportUpload,
        description: 'Upload the page that contains your photo.',
        icon: PassportIcon,
        title: 'Passport',
    },
    // eslint-disable-next-line sort-keys
    'driving-license': {
        description: 'Upload the front and back of your driving licence.',
        icon: DrivingLicenseIcon,
        title: 'Driving licence',
    },
    'identity-card': {
        description: 'Upload the front and back of your identity card.',
        icon: IdentityCardIcon,
        title: 'Identity card',
    },
    'nimc-slip': {
        countries: ['NG'],
        description: 'Upload the front and back of your identity card.',
        icon: NIMCSlipIcon,
        title: 'NIMC slip and proof of age',
    },
};

export const ManualDocumentUploadErrorCode = {
    DuplicateUpload: 'DuplicateUpload',
} as const;

export const GeneralDocumentRules: TDocumentRule[] = [
    {
        description: 'A clear colour photo or scanned image',
        icon: ClearPhoto,
    },
    {
        description: 'JPEG, JPG, PNG, PDF, or GIF',
        icon: ImageIcon,
    },
    {
        description: 'Less than 8MB',
        icon: LessThanEightIcon,
    },
];

export const NIMCDocumentRules: TDocumentRule[] = [
    ...GeneralDocumentRules,
    {
        description: 'Must be valid for at least 6 months',
        icon: ClockIcon,
    },
];
