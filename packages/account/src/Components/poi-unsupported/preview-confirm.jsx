import PropTypes from 'prop-types';
import React from 'react';
import { Text, Button } from '@deriv/components';
import ImagePreview from './image-preview.jsx';

const PreviewConfirm = ({
    image_preview,
    root_class,
    onCancel,
    onConfirm,
    cancel_btn_text,
    confirm_btn_text,
    title,
    description,
    is_selfie,
}) => {
    return (
        <React.Fragment>
            <ImagePreview image_preview={image_preview} root_class={root_class} is_selfie={is_selfie} />
            <Text as='p' size='s' weight='bold' color='prominent'>
                {title}
            </Text>
            <Text as='p' size='xs'>
                {description}
            </Text>
            <div className={`${root_class}__confirm-buttons`}>
                <Button large onClick={onCancel} secondary>
                    {cancel_btn_text}
                </Button>
                <Button large onClick={onConfirm} primary>
                    {confirm_btn_text}
                </Button>
            </div>
        </React.Fragment>
    );
};

PreviewConfirm.propTypes = {
    image_preview: PropTypes.string.isRequired,
    root_class: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    cancel_btn_text: PropTypes.string.isRequired,
    confirm_btn_text: PropTypes.string.isRequired,
};

export default PreviewConfirm;
