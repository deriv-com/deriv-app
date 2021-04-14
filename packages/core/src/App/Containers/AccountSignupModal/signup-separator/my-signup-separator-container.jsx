import classNames from 'classnames';
import * as React from 'react';

const MySignupSeparatorContainer = ({ children }) => <div className='my-signup-separator-container'>{children}</div>;

const MySignupSeparatorContainerLine = ({ is_invisible }) => (
    <div
        className={classNames('my-signup-separator-container__line', {
            'my-signup-separator-container__line--invisible': is_invisible,
        })}
    />
);

MySignupSeparatorContainer.Line = MySignupSeparatorContainerLine;

export default MySignupSeparatorContainer;
