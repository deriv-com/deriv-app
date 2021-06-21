import classNames from 'classnames';
import * as React from 'react';

const SignupSeparatorContainer = ({ children }) => <div className='signup-separator-container'>{children}</div>;

const SignupSeparatorContainerLine = ({ is_invisible }) => (
    <div
        className={classNames('signup-separator-container__line', {
            'signup-separator-container__line--invisible': is_invisible,
        })}
    />
);

SignupSeparatorContainer.Line = SignupSeparatorContainerLine;

export default SignupSeparatorContainer;
