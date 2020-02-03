import React from 'react';
import PropTypes from 'prop-types';
import IconBack from 'Assets/icon-back.jsx';
import './page-return.scss';

const PageReturn = ({ onClick, page_title }) => (
    <div className='page-return'>
        <div onClick={onClick} className='page-return__button'>
            <IconBack />
        </div>
        <span>{page_title}</span>
    </div>
);

PageReturn.propTypes = {
    onClick: PropTypes.func,
    page_title: PropTypes.string,
};

export default PageReturn;
