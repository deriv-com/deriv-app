import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Popup = ({ type }) => {
    return (
        <Fragment>
            <div className='popup'>

            </div>
        </Fragment>
    );
}

Popup.propTypes = {
    type: PropTypes.string,
}
 
export default Popup;