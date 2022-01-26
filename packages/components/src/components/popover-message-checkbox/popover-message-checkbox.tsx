import React from 'react';
import Checkbox from '../checkbox';

type PopoverMessageCheckboxProps = {
    defaultChecked: boolean;
    message: string;
    name: string;
    onChange: () => void;
};

const PopoverMessageCheckbox = ({
    checkboxLabel,
    defaultChecked,
    onChange,
    message,
    name,
}: PopoverMessageCheckboxProps) => (
    <React.Fragment>
        {message}
        <Checkbox defaultChecked={defaultChecked} onChange={onChange} name={name} label={checkboxLabel} />
    </React.Fragment>
);

export default PopoverMessageCheckbox;
