import React from 'react';
import Checkbox from '../checkbox';

type TPopoverMessageCheckbox = {
    defaultChecked?: boolean;
    message: string;
    name?: string;
    onChange: React.FormEventHandler<HTMLInputElement> &
        ((e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLSpanElement>) => void);
    checkboxLabel: React.ReactElement;
};

const PopoverMessageCheckbox = ({
    checkboxLabel,
    defaultChecked,
    onChange,
    message,
    name,
}: TPopoverMessageCheckbox) => (
    <React.Fragment>
        {message}
        <Checkbox defaultChecked={defaultChecked} onChange={onChange} name={name} label={checkboxLabel} />
    </React.Fragment>
);

export default PopoverMessageCheckbox;
