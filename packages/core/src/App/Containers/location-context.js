import React from 'react';
import PropTypes from 'prop-types';

export const LocationContext = React.createContext(null);

export const LocationProvider = ({ is_eu_country, show_cookie_banner, children }) => {
    return (
        <LocationContext.Provider value={{ is_eu_country, show_cookie_banner }}>{children}</LocationContext.Provider>
    );
};

LocationProvider.propTypes = {
    children: PropTypes.node.isRequired,
    is_eu_country: PropTypes.bool,
    show_cookie_banner: PropTypes.bool,
};
