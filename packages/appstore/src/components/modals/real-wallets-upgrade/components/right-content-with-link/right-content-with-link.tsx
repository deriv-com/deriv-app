import React from 'react';
import './right-content-with-link.scss';

const RightContentWithLink = ({ children }: React.PropsWithChildren) => (
    <div className='right-content-with-link'>
        <div className='right-content-with-link__link'>
            <div className='right-content-with-link__link-neck' />
        </div>
        <div className='right-content-with-link__content'>{children}</div>
    </div>
);

export default RightContentWithLink;
