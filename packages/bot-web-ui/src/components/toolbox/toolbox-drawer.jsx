import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import '../../assets/sass/toolbox-drawer.scss';

// TODO: use-from-shared - Use this icon from icons' shared package
const IconDrawer = () => (
    <svg
        className='db-toolbox-drawer__toggle-icon'
        xmlns='http://www.w3.org/2000/svg'
        width='16'
        height='16'
        viewBox='0 0 16 16'
    >
        <path
            fill='var(--text-less-prominent)'
            fillRule='nonzero'
            d='M8.87 2.164l5 5.5a.5.5 0 0 1 0 .672l-5 5.5a.5.5 0 0 1-.74-.672L12.824 8 8.13 2.836a.5.5 0 0 1 .74-.672zm-5 0l5 5.5a.5.5 0 0 1 0 .672l-5 5.5a.5.5 0 0 1-.74-.672L7.824 8 3.13 2.836a.5.5 0 1 1 .74-.672z'
        />
    </svg>
);

const Drawer = ({ children, className, is_open, toggleDrawer }) => {
    const toggleToolBoxDrawer = () => {
        if (toggleDrawer) {
            toggleDrawer(!is_open);
        }
    };

    return (
        <div
            className={classNames('db-toolbox-drawer', className, {
                'db-toolbox-drawer--open': is_open,
            })}
        >
            <div className='db-toolbox-drawer__container'>{children}</div>
            <div
                className={classNames('db-toolbox-drawer__toggle', {
                    'db-toolbox-drawer__toggle--open': is_open,
                })}
                onClick={toggleToolBoxDrawer}
            >
                <IconDrawer />
            </div>
        </div>
    );
};

Drawer.propTypes = {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    className: PropTypes.string,
    is_open: PropTypes.bool,
    toggleDrawer: PropTypes.func,
};

export default Drawer;
