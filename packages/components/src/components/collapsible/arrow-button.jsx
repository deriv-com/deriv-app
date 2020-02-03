import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { positionPropType } from "./utils";
import Icon from "../icon";

const IconArrow = props => <Icon icon="IcChevronDownBold" {...props} />;

const ArrowButton = ({ position, onClick, is_open }) => {
  let icon_arrow;
  switch (position) {
    case "top":
      icon_arrow = (
        <IconArrow
          className={classNames("dc-collapsible__icon", {
            "dc-collapsible__icon--top": true,
            "dc-collapsible__icon--is-open": is_open
          })}
        />
      );
      break;
    default:
      icon_arrow = (
        <IconArrow
          className={classNames("dc-collapsible__icon", {
            "dc-collapsible__icon--bottom": true,
            "dc-collapsible__icon--is-open": is_open
          })}
        />
      );
  }

  return (
    <div className="dc-collapsible__button" onClick={onClick}>
      {icon_arrow}
    </div>
  );
};

ArrowButton.propTypes = {
  is_open: PropTypes.bool,
  onClick: PropTypes.func,
  ...positionPropType
};

export default ArrowButton;
