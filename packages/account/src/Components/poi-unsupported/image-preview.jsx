import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

const ImagePreview = ({ is_selfie, root_class, image_preview }) => (
    <div
        className={cn(`${root_class}__image-preview`, {
            [`${root_class}__image-preview-selfie`]: is_selfie,
        })}
        style={{ '--poi-background-image-upload-preview': `url(${image_preview})` }}
    />
);

ImagePreview.propTypes = {
    is_selfie: PropTypes.bool,
    root_class: PropTypes.string,
    image_preview: PropTypes.string.isRequired,
};

export default ImagePreview;
