import { ComponentType, SVGAttributes } from 'react';
import DrivingLicenseIcon from '../../../../public/images/accounts/driving-license.svg';
import IdentityCardIcon from '../../../../public/images/accounts/identity-card.svg';
import NIMCSlipIcon from '../../../../public/images/accounts/nimc-slip.svg';
import PassportIcon from '../../../../public/images/accounts/passport.svg';

export type TDocumentType = {
    countries?: string[];
    description: string;
    icon: ComponentType<SVGAttributes<SVGElement>>;
    title: string;
    value: string;
};

export const documentTypes: TDocumentType[] = [
    {
        description: 'Upload the page that contains your photo.',
        icon: PassportIcon,
        title: 'Passport',
        value: 'passport',
    },
    {
        description: 'Upload the front and back of your driving licence.',
        icon: DrivingLicenseIcon,
        title: 'Driving licence',
        value: 'driving-license',
    },
    {
        description: 'Upload the front and back of your identity card.',
        icon: IdentityCardIcon,
        title: 'Identity card',
        value: 'identity-card',
    },
    {
        countries: ['NG'],
        description: 'Upload the front and back of your identity card.',
        icon: NIMCSlipIcon,
        title: 'NIMC slip and proof of age',
        value: 'nimc-slip',
    },
];
