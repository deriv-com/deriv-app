import React, { ChangeEvent, HTMLAttributes, PropsWithChildren, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/ui/dist/components/Text';
import './RadioGroup.scss';

type TItem = HTMLAttributes<HTMLDivElement> & {
    id?: string;
    value: string;
    label: string;
    disabled?: boolean;
    hidden?: boolean;
    hasError?: boolean;
};
type TItemWrapper = {
    shouldWrapItems?: boolean;
};
type TRadioGroup = {
    className?: string;
    name: string;
    onToggle: (e: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    selected: string;
} & TItemWrapper;

const ItemWrapper = ({ children, shouldWrapItems }: PropsWithChildren<TItemWrapper>) => {
    if (shouldWrapItems) {
        return <div className='p2p-v2-radio-group__item-wrapper'>{children}</div>;
    }

    return <>{children}</>;
};

const RadioGroup = ({
    className,
    name,
    onToggle,
    required,
    selected,
    shouldWrapItems,
    children,
}: PropsWithChildren<TRadioGroup>) => {
    const [selectedOption, setSelectedOption] = useState(selected);

    useEffect(() => {
        setSelectedOption(selected);
    }, [selected]);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(e.target.value);
        onToggle(e);
    };

    return (
        <div className={clsx('p2p-v2-radio-group', className)}>
            {Array.isArray(children) &&
                children
                    .filter(item => !item.props.hidden)
                    .map(item => (
                        <ItemWrapper key={item.props.value} shouldWrapItems={shouldWrapItems}>
                            <label
                                className={clsx('p2p-v2-radio-group__item', className, {
                                    'p2p-v2-radio-group__item--selected': selectedOption === item.props.value,
                                })}
                            >
                                <input
                                    id={item.props.id}
                                    name={name}
                                    className='p2p-v2-radio-group__input'
                                    type='radio'
                                    value={item.props.value}
                                    checked={selectedOption === item.props.value}
                                    onChange={onChange}
                                    disabled={item.props.disabled}
                                    required={required}
                                />
                                <span
                                    className={clsx('p2p-v2-radio-group__circle', {
                                        'p2p-v2-radio-group__circle--selected': selectedOption === item.props.value,
                                        'p2p-v2-radio-group__circle--disabled': item.props.disabled,
                                        'p2p-v2-radio-group__circle--error': item.props.hasError,
                                    })}
                                />
                                <Text
                                    size='lg'
                                    className={clsx('p2p-v2-radio-group__label', {
                                        'p2p-v2-radio-group__label--disabled': item.props.disabled,
                                        'p2p-v2-radio-group__label--error': item.props.hasError,
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

const Item = ({ children, hidden = false, ...props }: PropsWithChildren<TItem>) => (
    <div hidden={hidden} {...props}>
        {children}
    </div>
);

RadioGroup.Item = Item;

export default RadioGroup;
