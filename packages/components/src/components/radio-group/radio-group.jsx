import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Text from '../text';

const ItemWrapper = ({ children, should_wrap_items }) => {
    if (should_wrap_items) {
        return <div className='dc-radio-group__item-wrapper'>{children}</div>;
    }

    return children;
};

const RadioGroup = ({ className, name, onToggle, required, selected, should_wrap_items, children }) => {
    const [selected_option, setSelectedOption] = React.useState(selected);

    const onChange = event => {
        setSelectedOption(event.target.value);

        if (typeof onToggle === 'function') {
            onToggle(event);
        }
    };

    return (
        <div className={classNames('dc-radio-group', className)}>
            {children.map((item, idx) => (
                <ItemWrapper key={idx} should_wrap_items={should_wrap_items}>
                    <label
                        className={classNames('dc-radio-group__item', className, {
                            'dc-radio-group__item--selected': selected_option === item.props.value,
                        })}
                    >
                        <input
                            id={item.props.id}
                            name={name}
                            className='dc-radio-group__input'
                            type='radio'
                            value={item.props.value}
                            checked={selected_option === item.props.value}
                            onChange={onChange}
                            disabled={item.props.disabled}
                            required={required}
                        />
                        <span
                            className={classNames('dc-radio-group__circle', {
                                'dc-radio-group__circle--selected': selected_option === item.props.value,
                                'dc-radio-group__circle--disabled': item.props.disabled,
                            })}
                        />
                        <Text
                            size='xs'
                            className={classNames('dc-radio-group__label', {
                                'dc-radio-group__label--disabled': item.props.disabled,
                            })}
                        >
                            {item.props.label}
                        </Text>
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

const Item = ({ children, ...props }) => <div {...props}>{children}</div>;

RadioGroup.Item = Item;

export default RadioGroup;
