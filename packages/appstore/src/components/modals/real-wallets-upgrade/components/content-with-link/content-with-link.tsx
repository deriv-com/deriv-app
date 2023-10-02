import React from 'react';
import classNames from 'classnames';
import './content-with-link.scss';

type TContentWithLinkProps = {
    children: JSX.Element | Array<JSX.Element>;
    is_mobile?: boolean;
    rtl?: boolean;
    has_fork?: boolean;
    fork_width?: number;
    fork_margin?: number;
};

const ContentWithLink: React.FC<TContentWithLinkProps> = ({
    children,
    is_mobile,
    rtl,
    has_fork,
    fork_width = 15,
    fork_margin = 0,
}) => (
    <div
        className={classNames('content-with-link', {
            'content-with-link--has-fork': has_fork,
            'content-with-link--rtl': rtl,
        })}
    >
        <div
            className={classNames('content-with-link__content', {
                'content-with-link__content--rtl': rtl,
            })}
        >
            {children}
        </div>
        <div className='content-with-link__link'>
            {has_fork && (
                <div
                    className={classNames('content-with-link__link-fork', {
                        'content-with-link__link-fork--rtl': rtl,
                    })}
                    style={{
                        width: is_mobile ? '24.4rem' : `${fork_width}px`,
                        height: is_mobile ? '0.8rem' : `calc(100% - ${2 * fork_margin}px)`,
                    }}
                />
            )}
            <div
                className={classNames('content-with-link__link-neck', {
                    'content-with-link__link-neck--has-fork': has_fork,
                })}
            />
        </div>
    </div>
);

export default ContentWithLink;
