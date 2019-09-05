import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import ReactDOM          from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Icon              from 'Assets/icon.jsx';
import VerticalTab       from 'App/Components/Elements/VerticalTabs';

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
            <div
                ref={this.setWrapperRef}
                id={this.props.id}
                className={classNames('modal__container', this.props.className && `modal__${this.props.className}`)}
            >

                <div className='modal-header'>
                    {this.props.has_header &&
                    <h3 className={classNames({
                        'modal-header__sidebar'   : this.props.is_sidebar_enabled,
                        'modal-header--no-sidebar': !this.props.is_sidebar_enabled,
                    })}
                    >{this.props.title}
                    </h3>
                    }
                    <div className={classNames('modal-header__main', {
                        'modal-header--no-sidebar': !this.props.is_sidebar_enabled,
                    })}
                    >
                        {this.props.header &&
                        <div className='modal-header__section'>
                            {this.props.header}
                        </div>
                        }
                        <div id='dt_modal_close_icon' className='modal-header__close' onClick={this.props.toggleModal}>
                            <Icon icon='ModalIconClose' />
                        </div>
                    </div>
                </div>
                <VerticalTab
                    alignment='center'
                    classNameHeader='modal__tab-header'
                    id='modal'
                    is_sidebar_enabled={this.props.is_sidebar_enabled}
                    list={this.props.modal_content}
                    selected_index={this.props.selected_index}
                />
            </div>,
            this.el,
        );
    }

    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };
}

ModalElement.propTypes = {
    className     : PropTypes.string,
    has_header    : PropTypes.bool,
    header        : PropTypes.node,
    id            : PropTypes.string,
    is_open       : PropTypes.bool,
    modal_content : PropTypes.array,
    selected_index: PropTypes.number,
    title         : PropTypes.string,
    toggleModal   : PropTypes.func,
};

const Modal = ({
    className,
    header,
    id,
    is_open,
    is_sidebar_enabled,
    modal_content,
    selected_index,
    title,
    toggleModal,
    has_header,
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
            has_header={has_header}
            modal_content={modal_content}
            selected_index={selected_index}
            title={title}
            is_sidebar_enabled={is_sidebar_enabled}
            toggleModal={toggleModal}
        />
    </CSSTransition>
);

Modal.defaultProps = {
    is_sidebar_enabled: true,
    has_header        : true,
};

Modal.propTypes = {
    className         : PropTypes.string,
    has_header        : PropTypes.bool,
    header            : PropTypes.node,
    id                : PropTypes.string,
    is_open           : PropTypes.bool,
    is_sidebar_enabled: PropTypes.bool,
    modal_content     : PropTypes.array,
    selected_index    : PropTypes.number,
    title             : PropTypes.string,
    toggleModal       : PropTypes.func,
};

export {
    Modal,
    ModalElement,
};
