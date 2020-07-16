import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Radio from './radio.jsx';

class RadioGroup extends React.PureComponent {
    render() {
        const { selected, items, className } = this.props;
        return (
            <div className={classNames('dc-radio-group', className)}>
                {items.map((item, idx) => {
                    const is_selected = item.value === selected;
                    return (
                        <Radio
                            key={idx}
                            id={item.id}
                            value={item.value}
                            defaultChecked={is_selected}
                            onChange={this.props.onToggle}
                            className={classNames(item.className, {
                                'dc-radio-group__item--selected': is_selected,
                            })}
                            name={this.props.name}
                            disabled={item.disabled}
                        >
                            {item.label}
                        </Radio>
                    );
                })}
            </div>
        );
    }
}

RadioGroup.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.node.isRequired,
            value: PropTypes.oneOfType(PropTypes.bool.isRequired, PropTypes.string.isRequired),
        })
    ),
    onToggle: PropTypes.func,
    selected: PropTypes.oneOfType(PropTypes.bool, PropTypes.string),
};

export default RadioGroup;
