import ContentLoader from 'react-content-loader';
import React from 'react';
import PropTypes from 'prop-types';

const HeaderItemsLoader = ({ speed }) => (
    <ContentLoader
        speed={speed}
        primaryColor={'var(--general-section-1)'}
        secondaryColor={'var(--general-hover)'}
        style={{ width: '150px', height: '48px' }}
    >
        <circle cx='250' cy='65' r='42' />
        <circle cx='355' cy='65' r='42' />
    </ContentLoader>
);

HeaderItemsLoader.propTypes = {
    speed: PropTypes.number,
};

export default HeaderItemsLoader;
