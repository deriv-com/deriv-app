import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

class PositionsDrawerDialog extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside, true);
    }

    handleClickOutside = event => {
        if (this.ref && this.ref.current && this.props.is_visible) {
            if (this.ref.current.contains(event.target)) {
                event.stopPropagation();
            } else if (!this.props.toggle_ref.current.contains(event.target)) {
                this.props.toggleDialog();
            }
        }
    };

    render() {
        const { children, is_visible, left, top } = this.props;

        const dialog = (
            <CSSTransition
                in={is_visible}
                classNames={{
                    enter: 'positions-drawer-dialog--enter',
                    enterDone: 'positions-drawer-dialog--enter-done',
                    exit: 'positions-drawer-dialog--exit',
                }}
                timeout={150}
                unmountOnExit
            >
                <div
                    ref={this.ref}
                    className='positions-drawer-dialog'
                    style={{
                        top,
                        left: `calc(${left}px + 32px)`,
                    }}
                >
                    {children}
                </div>
            </CSSTransition>
        );

        return ReactDOM.createPortal(
            dialog, // use portal to render dialog above ThemedScrollbars container
            document.getElementById('deriv_app')
        );
    }
}

PositionsDrawerDialog.propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    is_visible: PropTypes.bool,
    left: PropTypes.number,
    toggle_ref: PropTypes.object,
    toggleDialog: PropTypes.func,
    top: PropTypes.number,
};

export default PositionsDrawerDialog;
