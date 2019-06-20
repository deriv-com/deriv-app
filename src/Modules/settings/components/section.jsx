import React from 'react';
import PropTypes from 'prop-types';

const Section = ({ title, description, children }) => (
    <div className='section'>
        <h2 className='section__title'>{title}</h2>
        <h4 className='section__description'>{description}</h4>
        {children}
    </div>
);

Section.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    description: PropTypes.string,
    title      : PropTypes.string,
};

export default Section;
