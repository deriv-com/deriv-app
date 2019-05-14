import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';
import { connect }  from 'Stores/connect';
import Toast  from '../Components/Elements/ToastMessage';

class ToastMessage extends React.Component {

    render() {
        return (
            <div className={classNames('toast', this.props.position)}>
                {
                    this.props.toast_messages.map((toast, id) => (
                        <Toast
                            key={id}
                            data={toast}
                            removeToastMessage={this.props.removeToastMessage}
                        />
                    ))
                }
            </div>
        );
    }
}

ToastMessage.propTypes = {
    position          : PropTypes.string,
    removeToastMessage: PropTypes.func,
    toast_messages    : PropTypes.arrayOf(
        PropTypes.shape({
            closeOnClick : PropTypes.func,
            delay        : PropTypes.number,
            is_auto_close: PropTypes.bool,
            message      : PropTypes.node,
            position     : PropTypes.string,
            type         : PropTypes.string,
        }),
    ),
};

export default connect(
    ({ ui }) => ({
        removeToastMessage: ui.removeToastMessage,
        toast_messages    : ui.toast_messages,
    })
)(ToastMessage);
