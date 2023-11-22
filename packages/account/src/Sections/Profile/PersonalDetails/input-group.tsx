import React from 'react';

type TInputGroup = {
    children: React.ReactNode;
    className: string;
};

const InputGroup = ({ children, className }: TInputGroup) => (
    <fieldset className='account-form__fieldset'>
        <div className={className}>{children}</div>
    </fieldset>
);

export default InputGroup;
