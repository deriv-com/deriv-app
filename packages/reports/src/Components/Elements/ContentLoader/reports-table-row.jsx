import ContentLoader from 'react-content-loader';
import React from 'react';
import PropTypes from 'prop-types';

const ReportsTableRowLoader = ({ speed }) => (
    <ContentLoader
        height={64}
        width={992}
        speed={speed}
        backgroundColor={'var(--general-hover)'}
        foregroundColor={'var(--general-active)'}
    >
        <rect x='16' y='16' rx='4' ry='4' width='32' height='32' />
        <rect x='52' y='16' rx='4' ry='4' width='32' height='32' />
        <rect x='132' y='28' rx='4' ry='4' width='101' height='8' />
        <rect x='273' y='28' rx='4' ry='4' width='120' height='8' />
        <rect x='460' y='28' rx='4' ry='4' width='46' height='8' />
        <rect x='593' y='28' rx='4' ry='4' width='46' height='8' />
        <rect x='726' y='28' rx='4' ry='4' width='64' height='8' />
        <rect x='906' y='28' rx='4' ry='4' width='64' height='8' />
    </ContentLoader>
);

ReportsTableRowLoader.propTypes = {
    speed: PropTypes.number,
};

export { ReportsTableRowLoader };
