import React from 'react';
import classNames from 'classnames';
import './right-content-with-link.scss';

type TContentWithLinkProps = {
    children: JSX.Element | Array<JSX.Element>;
    is_mobile?: boolean;
    rtl?: boolean;
    has_fork?: boolean;
    fork_width?: number;
    fork_margin?: number;
};

const RightContentWithLink: React.FC<TContentWithLinkProps> = ({
    children,
    is_mobile,
    rtl,
    fork_width = 15,
    fork_margin = 0,
}) => (
    <div
        className={classNames('right-content-with-link', {
            'right-content-with-link--rtl': rtl,
        })}
    >
        <div className='right-content-with-link__link'>
            <div className={classNames('right-content-with-link__link-neck', {})} />
        </div>
        <div
            className={classNames('right-content-with-link__content', {
                'right-content-with-link__content--rtl': rtl,
            })}
        >
            {children}
        </div>
    </div>
);

export default RightContentWithLink;
