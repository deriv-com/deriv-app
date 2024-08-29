import {
    DerivLightIcBlurryDocumentIcon,
    DerivLightIcCroppedDocumentIcon,
    DerivLightIcDocumentAddressMismatchIcon,
    DerivLightIcDocumentNameMismatchIcon,
    DerivLightIcEnvelopeIcon,
    DerivLightIcOldIssuedDocumentMoreThan12Icon,
} from '@deriv/quill-icons';
import { localize } from '@deriv-com/translations';

type TExampleImageConfig = {
    description: string;
    image: React.ComponentType<React.SVGAttributes<SVGElement>>;
};

export const getExampleImagesConfig = (): TExampleImageConfig[] => [
    {
        description: localize('Name in document doesn’t match your Deriv profile.'),
        image: DerivLightIcDocumentNameMismatchIcon,
    },
    {
        description: localize('Address in document doesn’t match address you entered above.'),
        image: DerivLightIcDocumentAddressMismatchIcon,
    },
    {
        description: localize('Document issued more than 12-months ago.'),
        image: DerivLightIcOldIssuedDocumentMoreThan12Icon,
    },
    {
        description: localize('Blurry document. All information must be clear and visible.'),
        image: DerivLightIcBlurryDocumentIcon,
    },
    {
        description: localize('Cropped document. All information must be clear and visible.'),
        image: DerivLightIcCroppedDocumentIcon,
    },
    {
        description: localize('An envelope with your name and address.'),
        image: DerivLightIcEnvelopeIcon,
    },
];
