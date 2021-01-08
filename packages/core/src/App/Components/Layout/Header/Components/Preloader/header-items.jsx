import ContentLoader from 'react-content-loader';
import React from 'react';
import PropTypes from 'prop-types';

const HeaderItemsLoader = ({ is_logged_in, speed }) => (
    <ContentLoader
        speed={speed}
        primaryColor={'var(--general-section-1)'}
        secondaryColor={'var(--general-hover)'}
        style={{ width: '150px', height: '48px' }}
    >
        {is_logged_in ? <LoggedInPreloader /> : <></>}
    </ContentLoader>
);

const LoggedInPreloader = () => (
    <>
        <circle cx='250' cy='65' r='42' />
        <circle cx='355' cy='65' r='42' />
    </>
);

HeaderItemsLoader.propTypes = {
    speed: PropTypes.number,
};

export { HeaderItemsLoader };
