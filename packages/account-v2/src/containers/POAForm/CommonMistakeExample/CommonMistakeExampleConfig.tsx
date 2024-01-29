import IcBlurryDocument from '../../../assets/ic-blurry-document.svg';
import IcCroppedDocument from '../../../assets/ic-cropped-document.svg';
import IcDocumentAddressMismatch from '../../../assets/ic-document-address-mismatch.svg';
import IcDocumentNameMismatch from '../../../assets/ic-document-name-mismatch.svg';
import IcEnvelope from '../../../assets/ic-envelop.svg';
import IcOldIssuedDocument from '../../../assets/ic-old-issued-document.svg';

/**
 * Returns a configuration containing images and descriptions for common POA document upload mistakes
 * @returns Array of objects containing image and description
 */
export const getExampleImagesConfig = () => [
    {
        description: 'Name in document doesn’t match your Deriv profile.',
        image: IcDocumentNameMismatch,
    },
    {
        description: 'Address in document doesn’t match address you entered above.',
        image: IcDocumentAddressMismatch,
    },
    {
        description: 'Document issued more than 6-months ago.',
        image: IcOldIssuedDocument,
    },
    {
        description: 'Blurry document. All information must be clear and visible.',
        image: IcBlurryDocument,
    },
    {
        description: 'Cropped document. All information must be clear and visible.',
        image: IcCroppedDocument,
    },
    {
        description: 'An envelope with your name and address.',
        image: IcEnvelope,
    },
];
