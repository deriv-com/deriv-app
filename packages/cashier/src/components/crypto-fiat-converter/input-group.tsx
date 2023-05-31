import React from 'react';

type TInputGroupProps = React.PropsWithChildren<{
    className: string;
}>;

const InputGroup = ({ children, className }: TInputGroupProps) => {
    return (
        <fieldset>
            <div className={className}>{children}</div>
        </fieldset>
    );
};

export default InputGroup;
