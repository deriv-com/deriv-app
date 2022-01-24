import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import FileUploader from './FileUploader';
import { Text, Input } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import SampleCreditCardModal from 'Components/sample-credit-card-modal';

const ExpandedCard = () => {
    const [filename, setFileName] = useState('');
    const [is_sample_modal_open, setIsSampleModalOpen] = useState(false);

    const handleUploadedFile = event => {
        setFileName(event.name);
    };
    const formatCardNumber = value => {
        console.log(value);
        // const regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g
        // const onlyNumbers = value.replace(/[^\d]/g, '')

        // return onlyNumbers.replace(regex, (regex, $1, $2, $3, $4) =>
        //     [$1, $2, $3, $4].filter(group => !!group).join(' ')
        // )
    };

    const initial_form = {
        cardNumber: '',
        cardImgName: '',
    };

    const handleSubmit = () => {
        console.log('hello');
    };

    return (
        <Formik initialValues={initial_form} onSubmit={handleSubmit}>
            {({ values, errors, isValid, touched, handleChange, handleBlur, isSubmitting }) => (
                <Form noValidate>
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
                        <div className='proof-of-ownership__card-open-inputs'>
                            <Input
                                label={localize('Card number')}
                                data-lpignore='true'
                                className='proof-of-ownership__card-open-inputs-cardnumber'
                                type='text'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.cardNumber
                                    .replace(/\s/g, '')
                                    .replace(/(\d{4})/g, '$1 ')
                                    .trim()}
                                name='cardNumber'
                                maxLength='18'
                                onKeyDown={e => {
                                    console.log(e.which);
                                }}
                            />

                            <Input
                                name='cardImgName'
                                required
                                className='proof-of-ownership__card-open-inputs-photo'
                                label={localize('Choose a photo')}
                                maxLength={255}
                                hint={localize('Accepted formats: pdf, jpeg, jpg, and png. Max file size: 8MB')}
                                value={filename}
                                readOnly
                                color='less-prominent'
                            />

                            <FileUploader handleFile={handleUploadedFile} />
                        </div>
                    </div>
                    <SampleCreditCardModal
                        is_open={is_sample_modal_open}
                        onClose={() => {
                            setIsSampleModalOpen(false);
                        }}
                    />
                </Form>
            )}
        </Formik>
    );
};

export default ExpandedCard;
