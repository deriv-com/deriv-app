import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import ReactDOM          from 'react-dom';
import { CSSTransition } from 'react-transition-group';
// import Icon              from 'Assets/icon.jsx';

// TODO: use-from-shared - Use this icon from icons' shared package
const IconClose = ({ className, onClick }) => (
    <svg onClick={onClick} className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <path
            className='color1-fill'
            fill='#2A3052'
            fillRule='nonzero'
            d='M8 7.293l4.146-4.147a.5.5 0 0 1 .708.708L8.707 8l4.147 4.146a.5.5 0 0 1-.708.708L8 8.707l-4.146 4.147a.5.5 0 0 1-.708-.708L7.293 8 3.146 3.854a.5.5 0 1 1 .708-.708L8 7.293z'
        />
    </svg>
);

class ModalElement extends React.PureComponent {
    constructor(props) {
        super(props);
        this.el    = document.createElement('div');
        this.state = {
            modal_root: document.getElementById('modal_root'),
        };
    }

    componentDidMount = () => {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.el.classList.add('dc-modal');
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
            <div
                ref={this.setWrapperRef}
                id={this.props.id}
                className={classNames(
                    'dc-modal__container',
                    this.props.className && `dc-modal__container_${this.props.className}`,
                )}
            >
                <div className={classNames('dc-modal-header', this.props.className && `dc-modal-header--${this.props.className}`)}>
                    {  this.props.title &&
                    <h3 className={classNames('dc-modal-header__title', this.props.className && `dc-modal-header__title--${this.props.className}`)}>{this.props.title}</h3>
                    }
                    { this.props.header &&
                    <div className={classNames('dc-modal-header__section', this.props.className && `dc-modal-header__section--${this.props.className}`)}>
                        {this.props.header}
                    </div>
                    }
                    <div
                        onClick={this.props.toggleModal}
                        className='dc-modal-header__close'
                    >
                        {this.props.has_close_icon && <IconClose />}
                    </div>
                </div>
                {this.props.children}
            </div>,
            this.el,
        );
    }

    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };
}

ModalElement.defaultProps = {
    has_close_icon: true,
};

ModalElement.propTypes = {
    children      : PropTypes.node,
    className     : PropTypes.string,
    has_close_icon: PropTypes.bool,
    header        : PropTypes.node,
    id            : PropTypes.string,
    is_open       : PropTypes.bool,
    title         : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
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
    has_close_icon,
}) => (
    <CSSTransition
        appear
        in={is_open}
        timeout={250}
        classNames={{
            appear   : 'dc-modal__container--enter',
            enter    : 'dc-modal__container--enter',
            enterDone: 'dc-modal__container--enter-done',
            exit     : 'dc-modal__container--exit',
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
            has_close_icon={has_close_icon}
        >
            {children}
        </ModalElement>
    </CSSTransition>
);

Modal.defaultProps = {
    has_close_icon: true,
};

Modal.propTypes = {
    children      : PropTypes.node,
    className     : PropTypes.string,
    has_close_icon: PropTypes.bool,
    header        : PropTypes.node,
    id            : PropTypes.string,
    is_open       : PropTypes.bool,
    title         : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
    toggleModal: PropTypes.func,
};

export default Modal;
