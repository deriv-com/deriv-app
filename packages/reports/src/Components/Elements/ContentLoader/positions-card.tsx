import ContentLoader from 'react-content-loader';
import React from 'react';

type TPositionCardLoader = {
    speed?: number;
};

const PositionsCardLoader = ({ speed }: TPositionCardLoader) => (
    <ContentLoader
        height={173}
        width={218}
        speed={speed}
        backgroundColor={'var(--general-section-1)'}
        foregroundColor={'var(--general-hover)'}
    >
        <rect x='43' y='19' rx='0' ry='0' width='56' height='8' />
        <rect x='147' y='19' rx='0' ry='0' width='56' height='8' />
        <rect x='12' y='50' rx='0' ry='0' width='44' height='8' />
        <rect x='13' y='68' rx='0' ry='0' width='192' height='8' />
        <rect x='5' y='89' rx='0' ry='0' width='208' height='1' />
        <rect x='12' y='104' rx='0' ry='0' width='44' height='8' />
        <rect x='12' y='9' rx='0' ry='0' width='24' height='24' />
        <rect x='116' y='11' rx='0' ry='0' width='24' height='24' />
        <rect x='12' y='118' rx='0' ry='0' width='88' height='8' />
        <rect x='116' y='104' rx='0' ry='0' width='44' height='8' />
        <rect x='116' y='118' rx='0' ry='0' width='88' height='8' />
        <rect x='12' y='139' rx='0' ry='0' width='44' height='8' />
        <rect x='12' y='153' rx='0' ry='0' width='88' height='8' />
        <rect x='116' y='139' rx='0' ry='0' width='44' height='8' />
        <rect x='116' y='153' rx='0' ry='0' width='88' height='8' />
    </ContentLoader>
);

export { PositionsCardLoader };
