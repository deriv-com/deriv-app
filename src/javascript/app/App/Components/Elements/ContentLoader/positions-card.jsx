import ContentLoader from 'react-content-loader';
import React         from 'react';
import PropTypes     from 'prop-types';

const PositionsCardLoader = ({ is_dark_theme, speed }) => (
    <ContentLoader
        height={173}
        width={218}
        speed={speed}
        primaryColor={is_dark_theme ? 'rgba(127, 131, 151, 0.16)' : 'rgba(0, 0, 0, 0.16)'}
        secondaryColor={is_dark_theme ? 'rgba(127, 131, 151, 0)' : '#f4f4f6'}
    >
        <rect x='43'  y='19'  rx='0' ry='0' width='56'  height='8' />
        <rect x='147' y='19'  rx='0' ry='0' width='56'  height='8' />
        <rect x='12'  y='50'  rx='0' ry='0' width='44'  height='8' />
        <rect x='13'  y='68'  rx='0' ry='0' width='192' height='8' />
        <rect x='5'   y='89'  rx='0' ry='0' width='208' height='1' />
        <rect x='12'  y='104' rx='0' ry='0' width='44'  height='8' />
        <rect x='12'  y='9'   rx='0' ry='0' width='24'  height='24' />
        <rect x='116' y='11'  rx='0' ry='0' width='24'  height='24' />
        <rect x='12'  y='118' rx='0' ry='0' width='88'  height='8' />
        <rect x='116' y='104' rx='0' ry='0' width='44'  height='8' />
        <rect x='116' y='118' rx='0' ry='0' width='88'  height='8' />
        <rect x='12'  y='139' rx='0' ry='0' width='44'  height='8' />
        <rect x='12'  y='153' rx='0' ry='0' width='88'  height='8' />
        <rect x='116' y='139' rx='0' ry='0' width='44'  height='8' />
        <rect x='116' y='153' rx='0' ry='0' width='88'  height='8' />
    </ContentLoader>
);

PositionsCardLoader.propTypes = {
    is_dark_theme: PropTypes.bool,
    speed        : PropTypes.number,
};

export default PositionsCardLoader;
