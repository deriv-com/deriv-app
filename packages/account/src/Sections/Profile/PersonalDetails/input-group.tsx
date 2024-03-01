import React from 'react';

type TInputGroup = {
    className?: string;
};

const InputGroup = ({ children, className }: React.PropsWithChildren<TInputGroup>) => (
    <fieldset className='account-form__fieldset'>
        <div className={className}>{children}</div>
    </fieldset>
);

export default InputGroup;
