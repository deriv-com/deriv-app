import React from 'react';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { Button, Input, Icon } from '@deriv/components';
import { compressImageFiles } from '@deriv/shared';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';

const FileUploader = ({ class_name, name, sub_index }) => {
    const { values, setFieldValue, errors, setFieldError } = useFormikContext();

    const [show_browse_button, setShowBrowseButton] = React.useState(!values[name]?.files?.[sub_index]?.name ?? '');
    // Create a reference to the hidden file input element
    const hidden_file_input = React.useRef(null);
    const handleClick = e => {
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        hidden_file_input.current.click();
    };

    const handleChange = async event => {
        event.nativeEvent.preventDefault();
        event.nativeEvent.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        const file_to_upload = await compressImageFiles([event.target.files[0]]);
        const payment_file_data = [...values[name]?.files];
        payment_file_data[sub_index] = file_to_upload[0];
        await setFieldValue(name, {
            ...values[name],
            files: payment_file_data,
        });
        setShowBrowseButton(!file_to_upload[0]);
    };

    const updateError = () => {
        const payment_method_error = errors?.[name]?.files;
        delete payment_method_error?.[sub_index];
        setFieldError(name, { ...errors?.[name], files: payment_method_error });
    };

    const handleIconClick = async e => {
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        hidden_file_input.current.value = '';

        const payment_file_data = values[name]?.files;
        payment_file_data[sub_index] = undefined;
        await setFieldValue(name, {
            ...values[name],
            files: payment_file_data ?? [],
        });
        setShowBrowseButton(prevState => !prevState);
        updateError();
    };
    return (
        <div className={classNames('poo-file-uploader', class_name)}>
            <input
                type='file'
                accept='image/png, image/jpeg, image/jpg, application/pdf'
                ref={hidden_file_input}
                onChange={handleChange}
                className='hidden-input'
                name={name}
            />
            <Input
                name='cardImgName'
                required
                label={localize('Choose a photo')}
                maxLength={255}
                hint={localize('Accepted formats: pdf, jpeg, jpg, and png. Max file size: 8MB')}
                value={values[name]?.files?.[sub_index]?.name ?? ''}
                readOnly
                color='less-prominent'
                type={'text'}
                tabIndex={'-1'}
                error={errors?.[name]?.files?.[sub_index]}
                trailing_icon={
                    <Icon
                        onClick={handleIconClick}
                        icon='IcCross'
                        height='100%'
                        size={20}
                        className={classNames('stack-top ', {
                            'remove-element': show_browse_button,
                        })}
                    />
                }
            />
            <Button
                className={classNames('proof-of-ownership__card-open-inputs-photo-btn ', {
                    'remove-element': !show_browse_button,
                })}
                text={localize('Browse')}
                onClick={handleClick}
                primary
            />
        </div>
    );
};

FileUploader.propTypes = {
    class_name: PropTypes.string,
    error: PropTypes.string,
    file_name: PropTypes.string,
    handleFile: PropTypes.func,
    index: PropTypes.number,
    item_index: PropTypes.number,
    name: PropTypes.string,
    sub_index: PropTypes.number,
    updateErrors: PropTypes.func,
};

export default FileUploader;
