import React from 'react';
import { Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import IcDocumentNameMismatch from '../../../Assets/ic-document-name-mismatch.svg';
import IcDocumentAddressMismatch from '../../../Assets/ic-document-address-mismatch.svg';
import IcOldIssuedDocument from '../../../Assets/ic-old-issued-document.svg';
import IcBlurryDocument from '../../../Assets/ic-blurry-document.svg';
import IcCroppedDocument from '../../../Assets/ic-cropped-document.svg';
import IcEnvelope from '../../../Assets/ic-envelop.svg';
import IcErrorBadge from '../../../Assets/ic-error-badge.svg';
import './common-mistake-examples.scss';

type TCommonMistakeExamplePartialsProps = {
    description: string;
    image: React.ReactElement;
};

/**
 * Wrapper for displaying the image and description of the mistake
 * @param {string} description - description of the mistake
 * @param {React.ReactElement} image - Sample image
 * @returns  {React.ReactElement} - React element
 */
const CommonMistakeExamplePartials = ({ description, image }: TCommonMistakeExamplePartialsProps) => (
    <div className='layout'>
        {image}
        <div className='description'>
            <IcErrorBadge />
            <Text size='xxxs' line_height='s' role='document'>
                {description}
            </Text>
        </div>
    </div>
);

/**
 * Returns a configuration containing image and description
 * @returns {Array} - Array of objects containing image and description
 */
const getExampleImageConfig = () => [
    {
        image: <IcDocumentNameMismatch />,
        description: localize('Name in document doesn’t match your Deriv profile.'),
        ref: 'name_mismatch',
    },
    {
        image: <IcDocumentAddressMismatch />,
        description: localize('Address in document doesn’t match address you entered above.'),
        ref: 'address_mismatch',
    },
    {
        image: <IcOldIssuedDocument />,
        description: localize('Document issued more than 6-months ago.'),
        ref: 'old_issued_document',
    },
    {
        image: <IcBlurryDocument />,
        description: localize('Blurry document. All information must be clear and visible.'),
        ref: 'blurry_document',
    },
    {
        image: <IcCroppedDocument />,
        description: localize('Cropped document. All information must be clear and visible.'),
        ref: 'cropped_document',
    },
    {
        image: <IcEnvelope />,
        description: localize('An envelope with your name and address.'),
        ref: 'envelope',
    },
];

/**
 * Displays the image and description of the mistake
 * @returns {React.ReactElement} - React element
 */
const CommonMistakeExamples = () => (
    <React.Fragment>
        <Text as='div' weight='bold' size={isMobile() ? 'xxs' : 'xs'} className='common-mistake-examples__title'>
            {localize('Common mistakes')}
        </Text>
        <div className='common-mistake-examples'>
            {getExampleImageConfig().map(config => (
                <CommonMistakeExamplePartials key={config.ref} description={config.description} image={config.image} />
            ))}
        </div>
    </React.Fragment>
);

export default CommonMistakeExamples;
