import React from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import './left-content-with-link.scss';

const LeftContentWithLink = observer(({ children, show_fork }: React.PropsWithChildren<{ show_fork: boolean }>) => {
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
});

export default LeftContentWithLink;
