import React from 'react';
import { Text } from '@deriv/components';
import IcDocumentNameMismatch from 'Assets/ic-document-name-mismatch.svg';
import IcDocumentAddressMismatch from 'Assets/ic-document-address-mismatch.svg';
import IcOldIssuedDocument from 'Assets/ic-old-issued-document.svg';
import IcBlurryDocument from 'Assets/ic-blurry-document.svg';
import IcCroppedDocument from 'Assets/ic-cropped-document.svg';
import IcEnvelope from 'Assets/ic-envelop.svg';
import IcErrorBadge from 'Assets/ic-error-badge.svg';
import { localize } from '@deriv/translations';
import './common-mistake-examples.scss';

type TCommonMistakeExamplePartialsProps = {
    description: string;
    image: React.ReactElement;
};

const CommonMistakeExamplePartials = ({ description, image }: TCommonMistakeExamplePartialsProps) => (
    <div className='layout'>
        {image}
        <div className='description'>
            <IcErrorBadge />
            <Text size='xs' line_height='s' role='document'>
                {description}
            </Text>
        </div>
    </div>
);

const CommonMistakeExamples = () => (
    <div className='common-mistake-examples'>
        <CommonMistakeExamplePartials
            description={localize('Name in document doesn’t match your Deriv profile.')}
            image={<IcDocumentNameMismatch />}
        />
        <CommonMistakeExamplePartials
            description={localize('Address in document doesn’t match address you entered above.')}
            image={<IcDocumentAddressMismatch />}
        />
        <CommonMistakeExamplePartials
            description={localize('Document issued more than 6-months ago.')}
            image={<IcOldIssuedDocument />}
        />
        <CommonMistakeExamplePartials
            description={localize('Blurry document. All information must be clear and visible.')}
            image={<IcBlurryDocument />}
        />
        <CommonMistakeExamplePartials
            description={localize('Cropped document. All information must be clear and visible.')}
            image={<IcCroppedDocument />}
        />
        <CommonMistakeExamplePartials
            description={localize('An envelope with your name and address.')}
            image={<IcEnvelope />}
        />
    </div>
);

export default CommonMistakeExamples;
