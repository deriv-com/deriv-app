import React from 'react';
import ContentLoader from 'react-content-loader';

const TransactionsLoader = () => (
    <ContentLoader
        speed={2}
        width={350}
        height={57}
        viewBox='0 0 350 57'
        primaryColor={'var(--general-section-1)'}
        secondaryColor={'var(--general-hover)'}
    >
        <rect x='0' y='0' rx='3' ry='3' width='350' height='57' />
    </ContentLoader>
);

export default TransactionsLoader;
