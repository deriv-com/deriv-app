import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import Icon from "../icon";

class Checkbox extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      checked: props.defaultChecked,
    };
  }

  onChange = e => {
    this.setState({ checked: e.target.checked });
    this.props.onChange(e);
  };

  render() {
    const {
      className,
      classNameLabel,
      id,
      label,
      onChange, // This needs to be here so it's not included in `otherProps`
      ...otherProps
    } = this.props;

    return (
      <label htmlFor={id} className={classNames("dc-checkbox", className)}>
        <input
          className="dc-checkbox__input"
          type="checkbox"
          id={id}
          onChange={this.onChange}
          {...otherProps}
        />
        <span
          className={classNames("dc-checkbox__box", {
            "dc-checkbox__box--active": this.state.checked,
          })}
        >
          {!!this.state.checked && <Icon icon="IcCheckmark" color="active" />}
        </span>
        <span className={classNames("dc-checkbox__label", classNameLabel)}>
          {label}
        </span>
      </label>
    );
  }
}

Checkbox.propTypes = {
  className: PropTypes.string,
  classNameLabel: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default Checkbox;
