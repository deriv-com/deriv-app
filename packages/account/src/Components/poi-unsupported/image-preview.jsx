import React from 'react';
import PropTypes from 'prop-types';

const ImagePreview = ({ root_class, image_preview }) => (
    <div
        className={`${root_class}__image-preview`}
        style={{ '--poi-background-image-upload-preview': `url(${image_preview})` }}
    />
);

ImagePreview.propTypes = {
    root_class: PropTypes.string,
    image_preview: PropTypes.string.isRequired,
};

export default ImagePreview;
