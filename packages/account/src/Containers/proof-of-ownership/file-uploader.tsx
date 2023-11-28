import React from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { Button, Input, Icon } from '@deriv/components';
import { compressImageFiles } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { TPaymentMethod, TProofOfOwnershipFormValue } from 'Types';

type TFileUploaderProps = {
    class_name?: string;
    name: TPaymentMethod;
    sub_index: number;
    index: number;
};

/**
 * Field to upload files for Payment methods in proof of ownership form
 * @name FileUploader
 * @param class_name - To add custom styles to class
 * @param name - Payment method name
 * @param sub_index - Index of the file
 * @param index - Index of the payment method
 * @returns React Component
 */

const FileUploader = ({ class_name, name, sub_index, index }: TFileUploaderProps) => {
    const { values, setFieldValue, errors, setFieldError } = useFormikContext<Partial<TProofOfOwnershipFormValue>>();

    const [show_browse_button, setShowBrowseButton] = React.useState(!values[name]?.[index]?.files?.[sub_index]?.name);
    // Create a reference to the hidden file input element
    const hidden_file_input = React.useRef(null);
    const handleClick = e => {
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        hidden_file_input?.current?.click();
    };

    const handleChange = async (event: React.FormEvent<HTMLInputElement>) => {
        event.nativeEvent.preventDefault();
        event.nativeEvent.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        const file_to_upload = await compressImageFiles([event.target.files[0]]);
        const payment_file_data = [...(values[name]?.[index]?.files ?? [])];
        payment_file_data[sub_index] = file_to_upload[0];
        const selected_payment_method = values?.[name];
        if (!selected_payment_method) {
            return;
        }

        selected_payment_method[index] = {
            ...selected_payment_method[index],
            files: payment_file_data,
        };
        await setFieldValue(name, [...selected_payment_method]);
        setShowBrowseButton(!file_to_upload[0]);
    };

    const updateError = () => {
        const payment_method_error = errors?.[name]?.[index]?.files;
        delete payment_method_error?.[sub_index];
        setFieldError(name, { ...(errors?.[name]?.[index] ?? {}), files: payment_method_error });
    };

    const handleIconClick = async e => {
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        if (hidden_file_input.current && 'value' in hidden_file_input.current) {
            hidden_file_input.current.value = '';
        }
        const payment_file_data = values[name]?.[index]?.files ?? [];
        payment_file_data[sub_index] = undefined;
        const selected_payment_method = values?.[name];
        if (!selected_payment_method) {
            return;
        }
        selected_payment_method[index] = {
            ...selected_payment_method[index],
            files: payment_file_data ?? [],
        };
        await setFieldValue(name, [...selected_payment_method]);
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
                value={values[name]?.[index]?.files?.[sub_index]?.name ?? ''}
                readOnly
                color='less-prominent'
                type={'text'}
                tabIndex={-1}
                error={errors?.[name]?.[index]?.files?.[sub_index]}
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

export default FileUploader;
