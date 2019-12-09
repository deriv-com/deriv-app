import React    from 'react';
import IconBack from 'Assets/icon-back.jsx';
import './page-return.scss';

const PageReturn = ({ onClick, page_title }) => (
    <div className='page-return'>
        <div onClick={ onClick } className='page-return__button'>
            <IconBack />
        </div>
        <span>
            { page_title }
        </span>
    </div>
);

export default PageReturn;
