import React from 'react';
import { Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { useStore } from '@deriv/stores';
import { getExampleImagesConfig } from '../../../Configs/poa-common-mistake-examples-config';
import IcErrorBadge from '../../../Assets/ic-error-badge.svg';
import './common-mistake-examples.scss';

type TCommonMistakeExamplePartialsProps = {
    description: JSX.Element;
    image: React.ReactElement;
};

/**
 * Wrapper for displaying the image and description of the mistake
 * @name CommonMistakeExamplePartials
 * @param description - description of the mistake
 * @param image - Sample image
 * @returns  React.ReactElement
 */
const CommonMistakeExamplePartials = ({ description, image }: TCommonMistakeExamplePartialsProps) => (
    <div className='common-mistake-examples__content-layout'>
        {image}
        <div className='common-mistake-examples__content-description'>
            <IcErrorBadge />
            <Text size='xxxs' line_height='s' role='document'>
                {description}
            </Text>
        </div>
    </div>
);

/**
 * Displays the image and description of the mistake
 * @returns React.ReactElement
 */
const CommonMistakeExamples = () => {
    const { client } = useStore();
    const { is_eu } = client;
    const example_images = getExampleImagesConfig(is_eu);
    return (
        <React.Fragment>
            <Text as='div' weight='bold' size={isMobile() ? 'xxs' : 'xs'} className='common-mistake-examples__title'>
                <Localize i18n_default_text='Common mistakes' />
            </Text>
            <div className='common-mistake-examples__content'>
                {example_images.map(config => (
                    <CommonMistakeExamplePartials
                        key={config.ref}
                        description={config.description}
                        image={<config.image />}
                    />
                ))}
            </div>
        </React.Fragment>
    );
};

export default CommonMistakeExamples;
