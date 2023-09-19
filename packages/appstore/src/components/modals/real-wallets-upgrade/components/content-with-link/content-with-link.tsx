import React from 'react';
import classNames from 'classnames';
import './content-with-link.scss';

type TContentWithLinkProps = {
    children: JSX.Element | Array<JSX.Element>;
    is_mobile?: boolean;
    is_right_forked?: boolean;
    show_fork?: boolean;
    fork_width?: number;
    fork_margin?: number;
};

const ContentWithLink: React.FC<TContentWithLinkProps> = ({
    children,
    is_mobile,
    is_right_forked,
    show_fork,
    fork_width = 15,
    fork_margin = 0,
}) => (
    <div
        className={classNames('content-with-link', {
            'content-with-link--right-forked': is_right_forked,
        })}
        style={{
            height: show_fork ? '100%' : 'auto',
        }}
    >
        <div
            className={classNames('content-with-link__content', {
                'content-with-link__content--right-forked': is_right_forked,
            })}
        >
            {children}
        </div>
        <div className='content-with-link__link'>
            {show_fork && (
                <div
                    className={classNames('content-with-link__link-fork', {
                        'content-with-link__link-fork--right-forked': is_right_forked,
                    })}
                    style={{
                        width: is_mobile ? '24.4rem' : `${fork_width}px`,
                        height: is_mobile ? '0.8rem' : `calc(100% - ${2 * fork_margin}px)`,
                    }}
                />
            )}
            <div
                className='content-with-link__link-neck'
                style={
                    is_mobile
                        ? { width: '1px', height: show_fork ? '1.5rem' : '2.3rem' }
                        : { width: show_fork ? '4.8rem' : '6.3rem' }
                }
            />
        </div>
    </div>
);

export default ContentWithLink;
