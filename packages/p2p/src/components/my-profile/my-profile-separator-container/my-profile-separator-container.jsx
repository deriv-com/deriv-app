import classNames from 'classnames';
import * as React from 'react';

const MyProfileSeparatorContainer = ({ children, is_invisible }) => (
    <div
        className={classNames('my-profile-separator-container', {
            'my-profile-separator-container--invisible': is_invisible,
        })}
    >
        {children}
    </div>
);

const MyProfileSeparatorContainerLine = () => <div className='my-profile-separator-container__line' />;

MyProfileSeparatorContainer.Line = MyProfileSeparatorContainerLine;

export default MyProfileSeparatorContainer;
