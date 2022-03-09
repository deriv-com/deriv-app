import React, { useState } from 'react';
import FileUploader from './FileUploader.jsx';
import { Input, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import SampleCreditCardModal from 'Components/sample-credit-card-modal';

const ExpandedCard = ({ handleChange, handleBlur, values, setFieldValue, index, error }) => {
    const [is_sample_modal_open, setIsSampleModalOpen] = useState(false);

    const handleUploadedFile = (name, file) => {
        setFieldValue(name, file);
    };
    return (
        <>
            <div>
                <Text className='proof-of-ownership__card-open-desc' as='p' color='general' size='xs'>
                    <Localize
                        i18n_default_text='Upload a photo of your card or bank statement showing your name and card number. Your card number must only show the first 6 and last 4 digits.<0> See example </0>'
                        components={[
                            <span
                                className='proof-of-ownership__card-open-desc-link'
                                key={0}
                                onClick={() => {
                                    setIsSampleModalOpen(true);
                                }}
                            />,
                        ]}
                    />
                </Text>
                <fieldset className='proof-of-ownership__card-open-inputs'>
                    <Input
                        label={localize('Card number')}
                        data-lpignore='true'
                        className='proof-of-ownership__card-open-inputs-cardnumber'
                        type='text'
                        onChange={handleChange}
                        is_disabled='true'
                        value={'123412xxxxxx1234'
                            .replace(/\s/g, '')
                            .replace(/(\w{4})/g, '$1 ')
                            .trim()}
                        onBlur={handleBlur}
                        maxLength='19'
                    />

                    <FileUploader
                        handleFile={handleUploadedFile}
                        fileName={values?.data?.[index]?.file?.name}
                        dataTestID={`uploader-${values?.data?.[index]?.id}`}
                        className='proof-of-ownership__card-open-inputs-photo'
                        name={`data[${index}].file`}
                        error={error?.file}
                    />
                </fieldset>
            </div>
            <SampleCreditCardModal
                is_open={is_sample_modal_open}
                onClose={() => {
                    setIsSampleModalOpen(false);
                }}
            />
        </>
    );
};

export default ExpandedCard;
