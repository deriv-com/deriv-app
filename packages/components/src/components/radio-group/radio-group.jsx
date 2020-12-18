import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const ItemWrapper = ({ children, should_wrap_items }) => {
    if (should_wrap_items) {
        return <div className='dc-radio-group__item-wrapper'>{children}</div>;
    }

    return children;
};

const RadioGroup = ({ className, items, name, onToggle, required, selected, should_wrap_items }) => {
    const [selected_option, setSelectedOption] = React.useState(selected);

    const onChange = event => {
        setSelectedOption(event.target.value);

        if (typeof onToggle === 'function') {
            onToggle(event);
        }
    };

    return (
        <div className={classNames('dc-radio-group', className)}>
            {items.map((item, idx) => (
                <ItemWrapper key={idx} should_wrap_items={should_wrap_items}>
                    <label
                        className={classNames('dc-radio-group__item', className, {
                            'dc-radio-group__item--selected': selected_option === item.value,
                        })}
                    >
                        <input
                            id={item.id}
                            name={name}
                            className='dc-radio-group__input'
                            type='radio'
                            value={item.value}
                            checked={selected_option === item.value}
                            onChange={onChange}
                            disabled={item.disabled}
                            required={required}
                        />
                        <span
                            className={classNames('dc-radio-group__circle', {
                                'dc-radio-group__circle--selected': selected_option === item.value,
                            })}
                        />
                        <span className='dc-radio-group__label'>{item.label}</span>
                    </label>
                </ItemWrapper>
            ))}
        </div>
    );
};

RadioGroup.propTypes = {
    className: PropTypes.string,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.node.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        })
    ),
    name: PropTypes.string,
    onToggle: PropTypes.func,
    required: PropTypes.bool,
    selected: PropTypes.any,
    should_wrap_items: PropTypes.bool,
};

export default RadioGroup;
