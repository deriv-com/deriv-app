import React from 'react';
import classNames from 'classnames';
import './content-with-link.scss';

const ContentWithLink = ({ children, hide_fork, is_right_forked, fork_width = 15, fork_margin }: any) => {
    return (
        <div
            className='content-with-link'
            style={{
                flexDirection: is_right_forked ? 'row' : 'row-reverse',
                height: hide_fork ? '100%' : 'auto',
            }}
        >
            <div
                className='content-with-link__content'
                style={{
                    margin: is_right_forked ? `0 ${fork_margin}px 0 0` : `0 0 0 ${fork_margin}px`,
                }}
            >
                {children}
            </div>
            <div
                className='content-with-link__fork'
                style={{
                    width: `${fork_width}px`,
                    display: hide_fork && 'none',
                    marginTop: hide_fork ? 'none' : `${fork_margin}px`,
                    marginBottom: hide_fork ? 'none' : `${fork_margin}px`,
                    rotate: is_right_forked ? '0deg' : '180deg',
                    height: hide_fork ? '50%' : 'auto',
                }}
            />
            <div className='content-with-link__neck'>
                <div className='content-with-link__neck-line' style={{ width: hide_fork ? '63px' : '48px' }} />
            </div>
        </div>
    );
};

export default ContentWithLink;
