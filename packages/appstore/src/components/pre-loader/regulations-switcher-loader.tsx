import ContentLoader from 'react-content-loader';
import React from 'react';
import { DesktopWrapper } from '@deriv/components';

const RegulationsSwitcherLoader = () => (
    <ContentLoader
        primaryColor={'var(--general-section-1)'}
        secondaryColor={'var(--general-hover)'}
        viewBox='0 0 200 50'
    >
        <DesktopWrapper>
            <rect x='6' y='5' rx='6' ry='6' width='190' height='40' />
        </DesktopWrapper>
    </ContentLoader>
);

export default RegulationsSwitcherLoader;
