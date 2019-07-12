import ContentLoader from 'react-content-loader';
import React         from 'react';
import PropTypes     from 'prop-types';

const TradeParamsLoader = ({ is_dark_theme, speed }) => (
    <ContentLoader
        height={548}
        width={240}
        speed={speed}
        primaryColor={is_dark_theme ? 'rgba(127, 131, 151, 0.16)' : '#f4f4f6'}
        secondaryColor={is_dark_theme ? 'rgba(127, 131, 151, 0.24)' : '#eaeaec'}
    >
        <rect x='0' y='0' rx='4' ry='4' width='240' height='76' />
        <rect x='0' y='84' rx='4' ry='4' width='240' height='132' />
        <rect x='0' y='224' rx='4' ry='4' width='240' height='120' />
        <rect x='0' y='352' rx='4' ry='4' width='240' height='194' />
    </ContentLoader>
);

TradeParamsLoader.propTypes = {
    is_dark_theme: PropTypes.bool,
    speed        : PropTypes.number,
};

export { TradeParamsLoader };
