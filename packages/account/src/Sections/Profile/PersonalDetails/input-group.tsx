import { PropsWithChildren } from 'react';

type TInputGroup = {
    className?: string;
};

const InputGroup = ({ children, className }: PropsWithChildren<TInputGroup>) => (
    <fieldset className='account-form__fieldset'>
        <div className={className}>{children}</div>
    </fieldset>
);

export default InputGroup;
