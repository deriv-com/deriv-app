import React from 'react';
import ContentLoader from 'react-content-loader';

const JournalLoader = () => (
    <ContentLoader
        speed={2}
        width={350}
        height={92}
        viewBox='0 0 350 92'
        primaryColor={'var(--general-section-1)'}
        secondaryColor={'var(--general-hover)'}
    >
        <rect x='0' y='0' rx='5' ry='5' width='350' height='92' />
    </ContentLoader>
);

export default JournalLoader;
