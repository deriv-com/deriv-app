import React from 'react';
import PropTypes from 'prop-types';
import { LocationContext } from './location-context';

export const Eu = ({ children }) => {
    const { is_eu } = React.useContext(LocationContext);
    if (is_eu) return <>{children}</>;
    return null;
};

export const NonEu = ({ children }) => {
    const { is_eu } = React.useContext(LocationContext);
    if (is_eu === false) return <>{children}</>;
    return null;
};

Eu.propTypes = {
    children: PropTypes.node.isRequired,
};

NonEu.propTypes = {
    children: PropTypes.node.isRequired,
};

export default {
    Eu,
    NonEu,
};
