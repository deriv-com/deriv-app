import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

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
        this.setState((prev_state) => ({
            is_open: !prev_state.is_open,
        }), () => {
            if (this.props.toggleDrawer) {
                this.props.toggleDrawer(this.state.is_open);
            }
        }
        );
    };

    render() {
        const {
            children,
            className,
            footer,
            header,
        } = this.props;

        return (
            <div className={classNames(
                'dc-drawer', className, {
                    'dc-drawer--open': this.state.is_open,
                })}
            >
                <div className='dc-drawer__container'>
                    {header &&
                        <div className='dc-drawer__header'>
                            {header}
                        </div>
                    }
                    <div className='dc-drawer__content'>
                        {children}
                    </div>
                    {footer &&
                        <div className='dc-drawer__footer'>
                            {footer}
                        </div>
                    }
                </div>
                <div
                    className={classNames('dc-drawer__toggle',
                        { 'dc-drawer__toggle--open': this.state.is_open })}
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
