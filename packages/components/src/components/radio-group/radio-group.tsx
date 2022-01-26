import React from 'react';
import classNames from 'classnames';
import Text from '../text';

type RadioGroupProps = {
    className: string;
    items: unknown;
    name: string;
    onToggle: () => void;
    required: boolean;
    selected: unknown;
    should_wrap_items: boolean;
};

const ItemWrapper = ({ children, should_wrap_items }) => {
    if (should_wrap_items) {
        return <div className='dc-radio-group__item-wrapper'>{children}</div>;
    }

    return children;
};

const RadioGroup = ({
    className,
    name,
    onToggle,
    required,
    selected,
    should_wrap_items,
    children,
}: RadioGroupProps) => {
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

const Item = ({ children, ...props }) => <div {...props}>{children}</div>;

RadioGroup.Item = Item;

export default RadioGroup;
