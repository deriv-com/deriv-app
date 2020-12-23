import * as React from 'react';

const MyProfileSeparatorContainer = ({ children }) => <div className='my-profile-separator-container'>{children}</div>;

const MyProfileSeparatorContainerLine = () => <div className='my-profile-separator-container__line' />;

MyProfileSeparatorContainer.Line = MyProfileSeparatorContainerLine;

export default MyProfileSeparatorContainer;
