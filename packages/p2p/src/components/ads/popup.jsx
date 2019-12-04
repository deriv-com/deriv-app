import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Popup = ({ type }) => {
    return (
        <Fragment>
            <p>{type}</p>
        </Fragment>
    );
}

Popup.propTypes = {
    type: PropTypes.string,
}
 
export default Popup;