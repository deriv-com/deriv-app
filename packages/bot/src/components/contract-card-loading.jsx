import React         from 'react';
import ContentLoader from 'react-content-loader';

const ContractCardLoader = () => (
    <ContentLoader
        height={ 153 }
        width={ 334 }
        speed={ 3 }
        primaryColor={'#f4f4f6'}
        secondaryColor={'#eaeaec'}
    >
        <rect x='12' y='10' rx='0' ry='0' width='32' height='32' />
        <rect x='52' y='22' rx='0' ry='0' width='70' height='8' />
        <rect x='134' y='10' rx='0' ry='0' width='32' height='32' />
        <rect x='176' y='22' rx='0' ry='0' width='70' height='8' />
        <rect x='12' y='57' rx='0' ry='0' width='308' height='1' />
        <rect x='50' y='75' rx='0' ry='0' width='60' height='8' />
        <rect x='50' y='90' rx='0' ry='0' width='100' height='8' />
        <rect x='50' y='115' rx='0' ry='0' width='60' height='8' />
        <rect x='50' y='130' rx='0' ry='0' width='100' height='8' />
        <rect x='180' y='75' rx='0' ry='0' width='60' height='8' />
        <rect x='180' y='90' rx='0' ry='0' width='100' height='8' />
        <rect x='180' y='115' rx='0' ry='0' width='60' height='8' />
        <rect x='180' y='130' rx='0' ry='0' width='100' height='8' />
    </ContentLoader>
);

export default ContractCardLoader;
