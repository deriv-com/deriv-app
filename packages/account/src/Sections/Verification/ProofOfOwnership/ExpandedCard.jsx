import React, { useState } from 'react';
import FileUploader from './FileUploader.jsx';
import { Text, Input } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import SampleCreditCardModal from 'Components/sample-credit-card-modal';

const ExpandedCard = ({ handleChange, handleBlur, values }) => {
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
                    <div className='proof-of-ownership__card-open-inputs-photo'>
                        <FileUploader handleFile={handleUploadedFile} fileName={filename} />
                    </div>
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
