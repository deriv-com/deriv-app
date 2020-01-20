import React         from 'react';
import ContentLoader from 'react-content-loader';

const ContractAuditLoader = () => (
    <div className='contract-audit__loader'>
        <ContentLoader
            height={12}
            width={150}
            speed={3}
            primaryColor={'var(--general-section-1)'}
            secondaryColor={'var(--general-hover)'}
        >
            <rect x='0' y='0' rx='0' ry='0' width='150' height='12' />
        </ContentLoader>
    </div>
);

export default ContractAuditLoader;
