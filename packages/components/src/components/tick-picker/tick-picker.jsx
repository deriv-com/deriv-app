import React, { useState } from "react";
import Button from "../button";
import Icon from "../icon";

const TickPicker = ({
  default_value,
  min_value,
  max_value,
  onSubmit,
  submit_label,
  singular_label,
  plural_label,
  onValueChange
}) => {
  const normalizedTick = tick => `${tick}`.padStart(2, 0);
  const [tick_value, setTickValue] = useState(parseInt(default_value));

  const handleDecrease = () => {
    if (tick_value - 1 >= min_value) {
      setTickValue(tick_value - 1);
    }
  };
  const handleIncrease = () => {
    if (tick_value + 1 <= max_value) {
      setTickValue(tick_value + 1);
    }
  };
  const handleClick = () => {
    onSubmit({
      target: {
        value: tick_value,
        name: "submit"
      }
    });
  };

  React.useEffect(() => {
    if (onValueChange) onValueChange(tick_value);
  }, [tick_value]);

  return (
    <div className="dc-tick-picker">
      <div className="dc-tick-picker__calculation">
        <Button rounded className="operator" onClick={handleDecrease}>
          <Icon icon="IcMinus" custom_color="var(--text-prominent)" />
        </Button>
        <div className="dc-tick-picker__holder">
          <span className="dc-tick-picker__holder--large">
            {normalizedTick(tick_value)}
          </span>
          <span className="dc-tick-picker__holder--small">
            {tick_value === 1 ? singular_label : plural_label}
          </span>
        </div>
        <Button rounded className="operator" onClick={handleIncrease}>
          <Icon icon="IcAdd" custom_color="var(--text-prominent)" />
        </Button>
      </div>
      <div className="dc-tick-picker__submit-wrapper">
        <Button rounded onClick={handleClick}>
          {submit_label}
        </Button>
      </div>
    </div>
  );
};

export default TickPicker;
