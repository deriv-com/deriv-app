import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Popup = ({ type }) => {
    return (
        <Fragment>
            <div className='buy-sell__popup'>
                <div className='buy-sell__popup-header'>
                
                </div>
                <div className='buy-sell__popup-content'>
                    <div>
                        <input />
                        <svg></svg>
                        <input />
                    </div>
                    <div>
                        <span></span>
                        <p></p>
                    </div>
                    <div>
                        <span></span>
                        <p></p>
                    </div>
                    <div>
                        <span></span>
                        <p></p>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

Popup.propTypes = {
    type: PropTypes.string,
}
 
export default Popup;