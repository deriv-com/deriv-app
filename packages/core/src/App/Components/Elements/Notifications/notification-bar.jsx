import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import Icon              from 'Assets/icon.jsx';

class NotificationBar extends React.Component {
    state = {};

    componentDidMount() {
        if (!this.state.show) {
            this.timer = setTimeout(() => {
                this.setState({ show: true });
            }, this.props.autoShow || 500);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    onClose = () => {
        this.setState({ show: false }, () => {
            clearTimeout(this.timer);
        });
    };

    render() {
        const {
            className,
            content,
            duration,
            has_content_close,
            type, // TODO: add support for different type of notifications
        } = this.props;

        return (
            <CSSTransition
                in={this.state.show}
                timeout={duration || 500}
                classNames={{
                    enterDone: 'notification-bar--is-active',
                }}
                unmountOnExit
            >
                <div
                    className={classNames('notification-bar', {
                        'notification-bar--info': type === 'info',
                        className,
                    })}
                >
                    <div className='notification-bar__message'>
                        {
                            has_content_close ?
                                React.Children.map(content, child =>
                                    React.cloneElement(child, { onClose: this.onClose.bind(this) })
                                )
                                : content
                        }
                    </div>
                    { !has_content_close &&
                        <div
                            onClick={this.onClose.bind(this)}
                            className='notification-bar__button'
                        >
                            <Icon icon='IconClose' className='notification-bar__icon' />
                        </div>
                    }
                </div>
            </CSSTransition>
        );
    }
}

NotificationBar.propTypes = {
    className: PropTypes.string,
    content  : PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    has_content_close: PropTypes.bool,
    type             : PropTypes.string,
};

export default NotificationBar;
