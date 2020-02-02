import React from 'react';
import PropTypes from 'prop-types';
import ContentLoader from 'react-content-loader';

export const MyAdsLoader = () => (
    <ContentLoader
        height={64}
        width={900}
        speed={2}
        primaryColor={'var(--general-hover)'}
        secondaryColor={'var(--general-active)'}
    >
        <rect x='1' y='20' rx='5' ry='5' width='90' height='10' />
        <rect x='150' y='20' rx='5' ry='5' width='90' height='10' />
        <rect x='300' y='20' rx='5' ry='5' width='90' height='10' />
        <rect x='446' y='20' rx='5' ry='5' width='55' height='10' />
        <rect x='600' y='20' rx='5' ry='5' width='75' height='10' />
        <rect x='750' y='15' rx='5' ry='5' width='45' height='16' />
        <rect x='803' y='15' rx='5' ry='5' width='55' height='16' />
    </ContentLoader>
);

MyAdsLoader.propTypes = {
    width: PropTypes.number,
};
