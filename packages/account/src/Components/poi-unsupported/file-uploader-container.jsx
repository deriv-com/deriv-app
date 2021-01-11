import React from 'react';

const FileUploaderContainer = ({ root_class, children }) => (
    <div className={`${root_class}__upload-container`}>{children}</div>
);

export default FileUploaderContainer;
