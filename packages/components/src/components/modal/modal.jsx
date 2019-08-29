import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import ReactDOM          from 'react-dom';
import { CSSTransition } from 'react-transition-group';
// import Icon              from 'Assets/icon.jsx';

class ModalElement extends React.PureComponent {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
        this.state = {
            modal_root: document.getElementById('modal_root'),
        };
    }

    componentDidMount = () => {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.el.classList.add('modal');
        this.state.modal_root.appendChild(this.el);
    };

    componentWillUnmount = () => {
        document.removeEventListener('mousedown', this.handleClickOutside);
        this.state.modal_root.removeChild(this.el);
    };

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.props.is_open) {
            this.props.toggleModal();
        }
    };

    render() {
        return ReactDOM.createPortal(
            <div ref={this.setWrapperRef} id={this.props.id} className={classNames('modal__container', this.props.className && `modal__${this.props.className}`)}>
                <div className='modal-header'>
                    <h3 className='modal-header__sidebar'>{this.props.title}</h3>
                    <div className='modal-header__main'>
                        { this.props.header &&
                            <div className='modal-header__section'>
                                {this.props.header}
                            </div>
                        }
                        <div id='dt_modal_close_icon' className='modal-header__close' onClick={this.props.toggleModal}>
                            {/* <Icon icon='ModalIconClose' /> */}
                        </div>
                    </div>
                </div>
                {this.props.children}
            </div>,
            this.el
        );
    }

    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };
}

ModalElement.propTypes = {
    children   : PropTypes.node,
    className  : PropTypes.string,
    header     : PropTypes.node,
    id         : PropTypes.string,
    is_open    : PropTypes.bool,
    title      : PropTypes.string,
    toggleModal: PropTypes.func,
};

const Modal = ({
    children,
    className,
    header,
    id,
    is_open,
    title,
    toggleModal,
}) => (
    <CSSTransition
        appear
        in={is_open}
        timeout={250}
        classNames={{
            appear   : 'modal__container--enter',
            enter    : 'modal__container--enter',
            enterDone: 'modal__container--enter-done',
            exit     : 'modal__container--exit',
        }}
        unmountOnExit
    >
        <ModalElement
            className={className}
            header={header}
            id={id}
            is_open={is_open}
            title={title}
            toggleModal={toggleModal}
        >
            {children}
        </ModalElement>
    </CSSTransition>
);

Modal.propTypes = {
    children   : PropTypes.node,
    className  : PropTypes.string,
    header     : PropTypes.node,
    id         : PropTypes.string,
    is_open    : PropTypes.bool,
    title      : PropTypes.string,
    toggleModal: PropTypes.func,
};

export default Modal;
