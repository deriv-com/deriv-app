import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

// TODO: use-from-shared - Use this icon from icons' shared package
const IconDrawer = () => (
    <svg
        className='dc-drawer__toggle-icon'
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

class Drawer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { is_open: props.is_open };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            is_open: nextProps.is_open,
        });
    }

    toggleDrawer = () => {
        this.setState(
            prev_state => ({
                is_open: !prev_state.is_open,
            }),
            () => {
                if (this.props.toggleDrawer) {
                    this.props.toggleDrawer(this.state.is_open);
                }
            }
        );
    };

    render() {
        const { children, className, footer, header } = this.props;

        return (
            <div
                className={classNames('dc-drawer', className, {
                    'dc-drawer--open': this.state.is_open,
                })}
            >
                <div className='dc-drawer__container'>
                    {header && <div className='dc-drawer__header'>{header}</div>}
                    <div className='dc-drawer__content'>{children}</div>
                    {footer && <div className='dc-drawer__footer'>{footer}</div>}
                </div>
                <div
                    className={classNames('dc-drawer__toggle', {
                        'dc-drawer__toggle--open': this.state.is_open,
                    })}
                    onClick={this.toggleDrawer}
                >
                    <IconDrawer />
                </div>
            </div>
        );
    }
}

Drawer.propTypes = {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    footer: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    header: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    is_open: PropTypes.bool,
};

export default Drawer;
