import React from 'react';
import ContentLoader from 'react-content-loader';

type TContractCardLoader = {
    speed?: number;
};

const ContractCardLoader = ({ speed = 3 }: TContractCardLoader) => (
    <ContentLoader
        height={153}
        width={334}
        speed={speed}
        backgroundColor={'var(--general-section-2)'}
        foregroundColor={'var(--general-hover)'}
    >
        <rect x='12' y='15' rx='0' ry='0' width='41' height='25' />
        <rect x='61' y='24' rx='0' ry='0' width='91' height='8' />
        <rect x='180' y='15' rx='0' ry='0' width='41' height='25' />
        <rect x='229' y='24' rx='0' ry='0' width='91' height='8' />
        <rect x='12' y='48' rx='0' ry='0' width='60' height='8' />
        <rect x='12' y='64' rx='0' ry='0' width='308' height='8' />
        <rect x='12' y='80' rx='0' ry='0' width='308' height='1' />
        <rect x='12' y='89' rx='0' ry='0' width='140' height='8' />
        <rect x='12' y='105' rx='0' ry='0' width='60' height='8' />
        <rect x='12' y='121' rx='0' ry='0' width='140' height='8' />
        <rect x='12' y='137' rx='0' ry='0' width='60' height='8' />
        <rect x='180' y='89' rx='0' ry='0' width='140' height='8' />
        <rect x='180' y='105' rx='0' ry='0' width='60' height='8' />
        <rect x='180' y='121' rx='0' ry='0' width='140' height='8' />
        <rect x='180' y='137' rx='0' ry='0' width='60' height='8' />
    </ContentLoader>
);

export default ContractCardLoader;
