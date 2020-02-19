import React from 'react';
import MediaDescription from './media-description.jsx';
import MediaHeading from './media-heading.jsx';
import MediaIcon from './media-icon.jsx';

const Media = props => <div className='media'>{props.children}</div>;

Media.Description = MediaDescription;
Media.Heading = MediaHeading;
Media.Icon = MediaIcon;

export default Media;
