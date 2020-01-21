import React from 'react';
import ContentLoader from 'react-content-loader';

const ContractCardLoader = () => (
    <ContentLoader
        className='transactions__loader'
        height={10}
        width={80}
        speed={3}
        primaryColor={'var(--general-section-1)'}
        secondaryColor={'var(--general-hover)'}
    >
        <rect x='0' y='0' rx='0' ry='0' width='100' height='12' />
    </ContentLoader>
);

export default ContractCardLoader;
