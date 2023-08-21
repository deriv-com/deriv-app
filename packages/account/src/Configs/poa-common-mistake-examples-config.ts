import React from 'react';
import { localize } from '@deriv/translations';
import IcDocumentNameMismatch from '../Assets/ic-document-name-mismatch.svg';
import IcDocumentAddressMismatch from '../Assets/ic-document-address-mismatch.svg';
import IcOldIssuedDocument from '../Assets/ic-old-issued-document.svg';
import IcBlurryDocument from '../Assets/ic-blurry-document.svg';
import IcCroppedDocument from '../Assets/ic-cropped-document.svg';
import IcEnvelope from '../Assets/ic-envelop.svg';

type TExampleImageConfig = {
    image: React.ComponentType<React.SVGAttributes<SVGElement>>;
    description: string;
    ref: string;
};
/**
 * Returns a configuration containing images and descriptions for common POA document upload mistakes
 * @returns Array of objects containing image and description
 */
export const getExampleImagesConfig = (): Array<TExampleImageConfig> => [
    {
        image: IcDocumentNameMismatch,
        description: localize('Name in document doesn’t match your Deriv profile.'),
        ref: 'name_mismatch',
    },
    {
        image: IcDocumentAddressMismatch,
        description: localize('Address in document doesn’t match address you entered above.'),
        ref: 'address_mismatch',
    },
    {
        image: IcOldIssuedDocument,
        description: localize('Document issued more than 6-months ago.'),
        ref: 'old_issued_document',
    },
    {
        image: IcBlurryDocument,
        description: localize('Blurry document. All information must be clear and visible.'),
        ref: 'blurry_document',
    },
    {
        image: IcCroppedDocument,
        description: localize('Cropped document. All information must be clear and visible.'),
        ref: 'cropped_document',
    },
    {
        image: IcEnvelope,
        description: localize('An envelope with your name and address.'),
        ref: 'envelope',
    },
];
