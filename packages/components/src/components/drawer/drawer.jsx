import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icon';
import Button from '../button';

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
        const {
            children,
            className,
            contentClassName,
            clear_stat_button_text,
            footer,
            header,
            is_clear_stat_disabled,
            is_mobile,
            onClearStatClick,
            zIndex,
        } = this.props;

        return (
            <div
                className={classNames('dc-drawer', className, {
                    'dc-drawer--mobile': is_mobile,
                    [`${className}--open dc-drawer--open`]: this.state.is_open && !is_mobile,
                    'dc-drawer--open-mobile': this.state.is_open && is_mobile,
                })}
                style={{ zIndex }}
            >
                <div
                    className={classNames('dc-drawer__toggle', {
                        'dc-drawer__toggle--open': this.state.is_open,
                        'dc-drawer__toggle--mobile': is_mobile,
                    })}
                    onClick={this.toggleDrawer}
                >
                    {is_mobile ? (
                        <Icon icon='IcChevronUp' className='dc-drawer__toggle-icon--mobile' />
                    ) : (
                        <IconDrawer />
                    )}
                    {is_mobile && this.state.is_open && (
                        <Button
                            id='db-run-panel__clear-button'
                            className='dc-drawer__clear-button'
                            is_disabled={is_clear_stat_disabled}
                            text={clear_stat_button_text}
                            onClick={onClearStatClick}
                            secondary
                        />
                    )}
                </div>
                <div
                    className={classNames('dc-drawer__container', {
                        'dc-drawer__container--mobile': is_mobile,
                    })}
                >
                    {header && <div className='dc-drawer__header'>{header}</div>}
                    <div className={classNames('dc-drawer__content', contentClassName)}>{children}</div>
                    {footer && <div className='dc-drawer__footer'>{footer}</div>}
                </div>
            </div>
        );
    }
}

Drawer.propTypes = {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    clear_stat_button_text: PropTypes.string,
    footer: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    header: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    is_clear_stat_disabled: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_open: PropTypes.bool,
    onClearStatClick: PropTypes.func,
    toggleDrawer: PropTypes.func,
};

export default Drawer;
