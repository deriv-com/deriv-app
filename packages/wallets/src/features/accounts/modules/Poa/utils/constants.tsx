import {
    DerivLightIcBlurryDocumentIcon,
    DerivLightIcCroppedDocumentIcon,
    DerivLightIcDocumentAddressMismatchIcon,
    DerivLightIcDocumentNameMismatchIcon,
    DerivLightIcEnvelopeIcon,
    DerivLightIcOldIssuedDocumentMoreThan12Icon,
} from '@deriv/quill-icons';

type TExampleImageConfig = {
    description: React.ReactNode;
    image: React.ComponentType<React.SVGAttributes<SVGElement>>;
};

export const getExampleImagesConfig = (): TExampleImageConfig[] => [
    {
        description: 'Name in document doesn’t match your Deriv profile.',
        image: DerivLightIcDocumentNameMismatchIcon,
    },
    {
        description: 'Address in document doesn’t match address you entered above.',
        image: DerivLightIcDocumentAddressMismatchIcon,
    },
    {
        description: 'Document issued more than 12-months ago.',
        image: DerivLightIcOldIssuedDocumentMoreThan12Icon,
    },
    {
        description: 'Blurry document. All information must be clear and visible.',
        image: DerivLightIcBlurryDocumentIcon,
    },
    {
        description: 'Cropped document. All information must be clear and visible.',
        image: DerivLightIcCroppedDocumentIcon,
    },
    {
        description: 'An envelope with your name and address.',
        image: DerivLightIcEnvelopeIcon,
    },
];
