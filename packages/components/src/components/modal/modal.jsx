import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import Body from "./modal-body.jsx";
import Footer from "./modal-footer.jsx";
import Icon from "../icon";

class ModalElement extends React.PureComponent {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
    this.state = {
      modal_root: document.getElementById("modal_root"),
    };
  }

  componentDidMount = () => {
    if (this.props.has_close_icon) {
      document.addEventListener("mousedown", this.handleClickOutside);
    }
    this.el.classList.add("dc-modal");
    this.state.modal_root.appendChild(this.el);
  };

  componentWillUnmount = () => {
    if (this.props.has_close_icon) {
      document.removeEventListener("mousedown", this.handleClickOutside);
    }
    this.state.modal_root.removeChild(this.el);
  };

  handleClickOutside = event => {
    if (
      this.props.has_close_icon &&
      this.wrapper_ref &&
      !this.wrapper_ref.contains(event.target) &&
      this.props.is_open
    ) {
      this.props.toggleModal();
    }
  };

  render() {
    const {
      id,
      title,
      className,
      header,
      children,
      has_close_icon,
      height,
      toggleModal,
      width,
    } = this.props;

    return ReactDOM.createPortal(
      <div
        ref={this.setWrapperRef}
        id={id}
        className={classNames("dc-modal__container", {
          [`dc-modal__container_${className}`]: className,
          "dc-modal__container--small": this.props.small,
        })}
        style={{
          height: height || "auto",
          width: width || "auto",
        }}
      >
        <div
          className={classNames("dc-modal-header", {
            [`dc-modal-header--${className}`]: className,
          })}
        >
          {title && (
            <h3
              className={classNames("dc-modal-header__title", {
                [`dc-modal-header__title--${className}`]: className,
              })}
            >
              {title}
            </h3>
          )}
          {header && (
            <div
              className={classNames("dc-modal-header__section", {
                [`dc-modal-header__section--${className}`]: className,
              })}
            >
              {header}
            </div>
          )}
          {has_close_icon && (
            <div onClick={toggleModal} className="dc-modal-header__close">
              <Icon icon="IcCross" />
            </div>
          )}
        </div>
        {children}
      </div>,
      this.el
    );
  }

  setWrapperRef = node => {
    this.wrapper_ref = node;
  };
}

ModalElement.defaultProps = {
  has_close_icon: true,
};

ModalElement.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  has_close_icon: PropTypes.bool,
  header: PropTypes.node,
  id: PropTypes.string,
  is_open: PropTypes.bool,
  small: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  toggleModal: PropTypes.func,
};

const Modal = ({
  children,
  className,
  header,
  id,
  is_open,
  has_close_icon,
  height,
  small,
  title,
  toggleModal,
  width,
}) => (
  <CSSTransition
    appear
    in={is_open}
    timeout={250}
    classNames={{
      appear: "dc-modal__container--enter",
      enter: "dc-modal__container--enter",
      enterDone: "dc-modal__container--enter-done",
      exit: "dc-modal__container--exit",
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
      height={height}
      small={small}
      width={width}
    >
      {children}
    </ModalElement>
  </CSSTransition>
);

Modal.Body = Body;
Modal.Footer = Footer;

Modal.defaultProps = {
  has_close_icon: true,
};

Modal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  has_close_icon: PropTypes.bool,
  header: PropTypes.node,
  height: PropTypes.string,
  id: PropTypes.string,
  is_open: PropTypes.bool,
  small: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  toggleModal: PropTypes.func,
  width: PropTypes.string,
};

export default Modal;
