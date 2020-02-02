import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

const Row = ({ children, className, has_hover }) => {
  const columns_in_row = React.Children.toArray(children).length; // toArray doesn't count null as a child

  return (
    <div
      role="row"
      className={classNames("dc-table__row", className, {
        "dc-table__row--hover": has_hover,
      })}
      style={{
        gridTemplateColumns: `repeat(${columns_in_row}, 1fr)`,
      }}
    >
      {children}
    </div>
  );
};

Row.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  has_hover: PropTypes.bool,
};

export default Row;
