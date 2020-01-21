import React from 'react';
import ContentLoader from 'react-content-loader';

const ContractCardLoader = () => (
    <ContentLoader
        className='contract-drawer__loader'
        height={8}
        width={44}
        speed={3}
        primaryColor={'var(--general-section-1)'}
        secondaryColor={'var(--general-hover)'}
    >
        <rect x='0' y='0' rx='0' ry='0' width='44' height='8' />
    </ContentLoader>
);

export default ContractCardLoader;
