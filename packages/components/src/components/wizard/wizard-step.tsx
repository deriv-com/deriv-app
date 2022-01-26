import React from 'react';
import classNames from 'classnames';

type StepProps = {
    children: React.ReactNode;
    className: string;
};

const Step = ({ children, className }: StepProps) => (
    <div className={classNames('wizard__main-step', className)}>{children}</div>
);

Step.defaultProps = {
    children: [],
};

export default Step;
