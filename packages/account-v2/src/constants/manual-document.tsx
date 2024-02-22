import { ComponentType, SVGAttributes } from 'react';
import IcPoiDrivingLicence from '../assets/manual-upload/ic-poi-driving-licence.svg';
import IcPoiIdentityCard from '../assets/manual-upload/ic-poi-identity-card.svg';
import IcPoiNimcSlip from '../assets/manual-upload/ic-poi-nimc-slip.svg';
import IcPoiPassport from '../assets/manual-upload/ic-poi-passport.svg';

type TDocumentType = {
    description: string;
    icon: ComponentType<SVGAttributes<SVGElement>>;
    title: string;
    value: string;
};

export const getManualUploadDocumentList = (isNimcRequired: boolean): TDocumentType[] => {
    const baseDocumentList = [
        {
            description: 'Upload the page that contains your photo.',
            icon: IcPoiPassport,
            title: 'Passport',
            value: 'passport',
        },
        {
            description: 'Upload the front and back of your driving licence.',
            icon: IcPoiDrivingLicence,
            title: 'Driving licence',
            value: 'driving_licence',
        },
        {
            description: 'Upload the front and back of your identity card.',
            icon: IcPoiIdentityCard,
            title: 'Identity card',
            value: 'national_identity_card',
        },
    ];

    const nimcDocument = {
        description: 'Upload both of these documents to prove your identity.',
        icon: IcPoiNimcSlip,
        title: 'NIMC slip and proof of age',
        value: 'nimc_slip',
    };

    return isNimcRequired ? [...baseDocumentList, nimcDocument] : baseDocumentList;
};
