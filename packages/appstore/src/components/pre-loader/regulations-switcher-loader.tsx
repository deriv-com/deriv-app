import ContentLoader from 'react-content-loader';
import React from 'react';

const RegulationsSwitcherLoader = () => (
    <ContentLoader
        primaryColor={'var(--general-section-1)'}
        secondaryColor={'var(--general-hover)'}
        viewBox='0 0 200 50'
    >
        <rect x='6' y='5' rx='6' ry='6' width='190' height='40' />
    </ContentLoader>
);

export default RegulationsSwitcherLoader;
