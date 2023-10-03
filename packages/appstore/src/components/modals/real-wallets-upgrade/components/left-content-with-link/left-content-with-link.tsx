import React from 'react';
import classNames from 'classnames';
import './left-content-with-link.scss';

type TContentWithLinkProps = {
    children: JSX.Element | Array<JSX.Element>;
    is_mobile?: boolean;
    rtl?: boolean;
    has_fork?: boolean;
    fork_width?: number;
    fork_margin?: number;
};

const LeftContentWithLink: React.FC<TContentWithLinkProps> = ({
    children,
    is_mobile,
    rtl,
    fork_width = 15,
    fork_margin = 0,
}) => (
    <div
        className={classNames('left-content-with-link', {
            'left-content-with-link--rtl': rtl,
        })}
    >
        <div
            className={classNames('left-content-with-link__content', {
                'left-content-with-link__content--rtl': rtl,
            })}
        >
            {children}
        </div>
        <div className='left-content-with-link__link'>
            <div
                className={classNames('left-content-with-link__link-fork', {
                    'left-content-with-link__link-fork--rtl': rtl,
                })}
            />
            <div className={classNames('left-content-with-link__link-neck', {})} />
        </div>
    </div>
);

export default LeftContentWithLink;
