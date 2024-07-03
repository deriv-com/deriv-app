import {
    DerivLightIcBlurryDocumentIcon,
    DerivLightIcCroppedDocumentIcon,
    DerivLightIcDocumentAddressMismatchIcon,
    DerivLightIcDocumentNameMismatchIcon,
    DerivLightIcEnvelopeIcon,
    DerivLightIcOldIssuedDocumentMoreThan12Icon,
} from '@deriv/quill-icons';
import i18n from '../../../../translations/i18n';

type TExampleImageConfig = {
    description: React.ReactNode;
    image: React.ComponentType<React.SVGAttributes<SVGElement>>;
};

export const getExampleImagesConfig = (): TExampleImageConfig[] => [
    {
        description: i18n.t('Name in document doesn’t match your Deriv profile.'),
        image: DerivLightIcDocumentNameMismatchIcon,
    },
    {
        description: i18n.t('Address in document doesn’t match address you entered above.'),
        image: DerivLightIcDocumentAddressMismatchIcon,
    },
    {
        description: i18n.t('Document issued more than 12-months ago.'),
        image: DerivLightIcOldIssuedDocumentMoreThan12Icon,
    },
    {
        description: i18n.t('Blurry document. All information must be clear and visible.'),
        image: DerivLightIcBlurryDocumentIcon,
    },
    {
        description: i18n.t('Cropped document. All information must be clear and visible.'),
        image: DerivLightIcCroppedDocumentIcon,
    },
    {
        description: i18n.t('An envelope with your name and address.'),
        image: DerivLightIcEnvelopeIcon,
    },
];
