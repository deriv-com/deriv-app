import React from 'react';
import classNames from 'classnames';
import { useStore } from '@deriv/stores';
import './left-content-with-link.scss';

type TContentWithLinkProps = {
    children: JSX.Element | Array<JSX.Element>;
    show_fork?: boolean;
};

const LeftContentWithLink: React.FC<TContentWithLinkProps> = ({ children, show_fork }) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    return (
        <div className='left-content-with-link'>
            <div className='left-content-with-link__content'>{children}</div>
            <div className='left-content-with-link__link'>
                {(show_fork || is_mobile) && <div className='left-content-with-link__link-fork' />}
                <div
                    className={classNames('left-content-with-link__link-neck', {
                        'left-content-with-link__link-neck--show-fork': show_fork && !is_mobile,
                    })}
                />
            </div>
        </div>
    );
};

export default LeftContentWithLink;
