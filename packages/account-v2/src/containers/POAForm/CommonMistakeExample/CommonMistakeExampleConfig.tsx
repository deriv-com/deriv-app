import React from 'react';
import {
    DerivLightIcBlurryDocumentIcon,
    DerivLightIcCroppedDocumentIcon,
    DerivLightIcDocumentAddressMismatchIcon,
    DerivLightIcDocumentNameMismatchIcon,
    DerivLightIcEnvelopIcon,
    DerivLightIcOldIssuedDocumentIcon,
} from '@deriv/quill-icons';

/**
 * Returns a configuration containing images and descriptions for common POA document upload mistakes
 * @returns Array of objects containing image and description
 */
export const getExampleImagesConfig = () => [
    {
        description: 'Name in document doesn’t match your Deriv profile.',
        image: <DerivLightIcDocumentNameMismatchIcon />,
    },
    {
        description: 'Address in document doesn’t match address you entered above.',
        image: <DerivLightIcDocumentAddressMismatchIcon />,
    },
    {
        description: 'Document issued more than 6-months ago.',
        image: <DerivLightIcOldIssuedDocumentIcon />,
    },
    {
        description: 'Blurry document. All information must be clear and visible.',
        image: <DerivLightIcBlurryDocumentIcon />,
    },
    {
        description: 'Cropped document. All information must be clear and visible.',
        image: <DerivLightIcCroppedDocumentIcon />,
    },
    {
        description: 'An envelope with your name and address.',
        image: <DerivLightIcEnvelopIcon />,
    },
];
