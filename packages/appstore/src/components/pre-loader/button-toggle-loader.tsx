import ContentLoader from 'react-content-loader';
import React from 'react';
import { MobileWrapper } from '@deriv/components';

const ButtonToggleLoader = () => (
    <ContentLoader
        height={200}
        primaryColor={'var(--general-section-1)'}
        secondaryColor={'var(--general-hover)'}
        viewBox='0 0 380 70'
    >
        <MobileWrapper>
            <rect x='5' y='40' rx='5' ry='5' width='400' height='500' />
        </MobileWrapper>
    </ContentLoader>
);

export default ButtonToggleLoader;
