import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

class Drawer extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            is_open: true,
        };
    }

    toggleDrawer = () => {
        this.setState({ is_open: !this.state.is_open });
        if (this.props.toggleDrawer) {
            this.props.toggleDrawer(this.state.is_open);
        }
    };

    render() {
        const {
            children,
            className,
            footer,
            header,
        } = this.props;

        return (
            <div className={classNames('dc-drawer',
                this.state.is_open && `dc-drawer--${'open'}`)}
            >
                <div className={classNames('dc-drawer__container',
                    className && `dc-drawer__container--${className}`)}
                >
                    {header &&
                        <div className={classNames('dc-drawer__header',
                            className && `dc-drawer__header--${className}`)}
                        >
                            {header}
                        </div>
                    }
                    <div className={classNames('dc-drawer__content',
                        className && `dc-drawer__content--${className}`)}
                    >
                        {children}
                    </div>
                    {footer &&
                        <div className={classNames('dc-drawer__footer',
                            className && `dc-drawer__footer--${className}`)}
                        >
                            {footer}
                        </div>
                    }
                </div>
                <div
                    className={classNames('dc-drawer__toggle',
                        this.state.is_open && 'dc-drawer__toggle--open')}
                    onClick={this.toggleDrawer}
                >
                    <div className='dc-drawer__toggle-icon-wraper'>
                        <div className='dc-drawer__toggle-icon' />
                    </div>
                </div>
            </div>
        );
    }
}

Drawer.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    footer: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string,
    ]),
    header: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string,
    ]),
    is_open: PropTypes.bool,
};

export default Drawer;
