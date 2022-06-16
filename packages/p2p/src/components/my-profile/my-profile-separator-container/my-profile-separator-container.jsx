import classNames from 'classnames';
import * as React from 'react';

const MyProfileSeparatorContainer = ({ children }) => <div className='my-profile-separator-container'>{children}</div>;

const MyProfileSeparatorContainerLine = ({ is_invisible }) => (
    <div
        className={classNames('my-profile-separator-container__line', {
            'my-profile-separator-container__line--invisible': is_invisible,
        })}
    />
);

MyProfileSeparatorContainer.Line = MyProfileSeparatorContainerLine;

export default MyProfileSeparatorContainer;
