import classNames from 'classnames';
import React from 'react';
import Checkbox from '../checkbox/checkbox';
import Text from '../text';

type TCompositeCheckbox = {
    name: string;
    value: boolean;
    onChange: React.FormEventHandler<HTMLInputElement> &
        ((e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLSpanElement>) => void);
    className?: string;
    label: JSX.Element;
    id?: string;
    description: JSX.Element;
};

const CompositeCheckbox = ({
    name,
    value,
    onChange,
    className,
    label,
    id,
    description,
    children,
    ...props
}: React.PropsWithChildren<TCompositeCheckbox & React.ComponentProps<typeof Checkbox>>) => {
    const onClickContainer = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        onChange({
            target: {
                value: !value,
            },
        } as any);
    };

    return (
        <div
            className={classNames('composite-checkbox', className, {
                'composite-checkbox--active': !!value,
            })}
            onClick={onClickContainer}
        >
            <Checkbox id={id} label={label} name={name} value={value} onChange={onChange} {...props} />
            <Text
                as='p'
                size='xxxs'
                line_height='s'
                className={classNames('composite-checkbox__description', `${className}__description`)}
            >
                {description}
            </Text>
            {children}
        </div>
    );
};

export default CompositeCheckbox;
