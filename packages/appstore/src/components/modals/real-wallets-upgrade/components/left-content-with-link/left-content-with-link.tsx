import React from 'react';
import './left-content-with-link.scss';

type TContentWithLinkProps = {
    children: JSX.Element | Array<JSX.Element>;
};

const LeftContentWithLink: React.FC<TContentWithLinkProps> = ({ children }) => (
    <div className='left-content-with-link'>
        <div className='left-content-with-link__content'>{children}</div>
        <div className='left-content-with-link__link'>
            <div className='left-content-with-link__link-fork' />
            <div className='left-content-with-link__link-neck' />
        </div>
    </div>
);

export default LeftContentWithLink;
