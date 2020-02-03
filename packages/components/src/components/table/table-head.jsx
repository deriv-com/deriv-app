import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

const Head = ({ children, align, className }) => (
  <div
    role="columnheader"
    className={classNames("dc-table__head", className, {
      "dc-table__cell--right": align === "right"
    })}
  >
    {children}
  </div>
);

Head.propTypes = {
  align: PropTypes.oneOf(["left", "right"]),
  children: PropTypes.node,
  className: PropTypes.string
};

export default Head;
