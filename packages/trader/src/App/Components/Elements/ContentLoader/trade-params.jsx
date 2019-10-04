import ContentLoader from 'react-content-loader';
import React         from 'react';
import PropTypes     from 'prop-types';

const TradeParamsLoader = ({ speed }) => (
    <ContentLoader
        height={548}
        width={240}
        speed={speed}
        primaryColor={'var(--general-section-1)'}
        secondaryColor={'var(--general-hover)'}
    >
        <rect x='0' y='0' rx='4' ry='4' width='240' height='76' />
        <rect x='0' y='84' rx='4' ry='4' width='240' height='132' />
        <rect x='0' y='224' rx='4' ry='4' width='240' height='120' />
        <rect x='0' y='352' rx='4' ry='4' width='240' height='194' />
    </ContentLoader>
);

TradeParamsLoader.propTypes = {
    speed: PropTypes.number,
};

export { TradeParamsLoader };
