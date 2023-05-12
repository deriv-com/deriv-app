import React, { ChangeEvent } from 'react';
import classNames from 'classnames';
import Text from '../text';

type TItem = React.HTMLAttributes<HTMLDivElement> & { id?: string; value: string; label: string; disabled: boolean };
type TItemWrapper = {
    should_wrap_items?: boolean;
};
type TRadioGroup = {
    className?: string;
    name: string;
    onToggle: (e: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    selected: string;
} & TItemWrapper;

const ItemWrapper = ({ children, should_wrap_items }: React.PropsWithChildren<TItemWrapper>) => {
    if (should_wrap_items) {
        return <div className='dc-radio-group__item-wrapper'>{children}</div>;
    }

    return <React.Fragment>{children}</React.Fragment>;
};

const RadioGroup = ({
    className,
    name,
    onToggle,
    required,
    selected,
    should_wrap_items,
    children,
}: React.PropsWithChildren<TRadioGroup>) => {
    const [selected_option, setSelectedOption] = React.useState(selected);

    React.useEffect(() => {
        setSelectedOption(selected);
    }, [selected]);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(e.target.value);
        onToggle(e);
    };

    return (
        <div className={classNames('dc-radio-group', className)}>
            {Array.isArray(children) &&
                children.map(item => (
                    <ItemWrapper key={item.props.value} should_wrap_items={should_wrap_items}>
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

const Item = ({ children, ...props }: React.PropsWithChildren<TItem>) => <div {...props}>{children}</div>;

RadioGroup.Item = Item;

export default RadioGroup;
