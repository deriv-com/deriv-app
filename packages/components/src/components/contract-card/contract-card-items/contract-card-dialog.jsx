import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './sass/contract-card-dialog.scss';

class ContractCardDialog extends React.Component {
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
                this.props.toggleDialog(event);
            }
        }
    };

    render() {
        const { children, is_visible, left, top } = this.props;

        const dialog = (
            <CSSTransition
                in={is_visible}
                classNames={{
                    enter: 'dc-contract-card-dialog--enter',
                    enterDone: 'dc-contract-card-dialog--enter-done',
                    exit: 'dc-contract-card-dialog--exit',
                }}
                timeout={150}
                unmountOnExit
            >
                <div
                    ref={this.ref}
                    className='dc-contract-card-dialog'
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

ContractCardDialog.propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    is_visible: PropTypes.bool,
    left: PropTypes.number,
    toggle_ref: PropTypes.object,
    toggleDialog: PropTypes.func,
    top: PropTypes.number,
};

export default ContractCardDialog;
