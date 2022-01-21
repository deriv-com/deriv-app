import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FileUploader from './FileUploader';
import { Text, Input } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import SampleCreditCardModal from 'Components/sample-credit-card-modal';

const ExpandedCard = () => {
    const [filename, setFileName] = useState('Choose a photo');
    const [is_sample_modal_open, setIsSampleModalOpen] = useState(false);

    const handleUploadedFile = (event) => {
        setFileName(event.name)
    }

    return (
        <>
            <div>
                <Text className="proof-of-ownership__card-open-desc"
                    as='p'
                    color='general'
                    size='xs'
                >
                    <Localize
                        i18n_default_text='Upload a photo of your card or bank statement showing your name and card number. Your card number must only show the first 6 and last 4 digits.<0> See example </0>'
                        components={[<span
                            className='proof-of-ownership__card-open-desc-link'
                            key={0}
                            onClick={() => {
                                setIsSampleModalOpen(true);
                            }}
                        />]}
                    />
                </Text>
                <div className='proof-of-ownership__card-open-inputs'>
                    <Input
                        data-lpignore='true'
                        className="proof-of-ownership__card-open-inputs-cardnumber"
                        type='number'
                        name='cardnumber'
                        label={localize('Card number')}
                        required
                        max_characters={2}
                        placeholder={'1234 56xx xxxx 1234'}
                    // onKeyUp={(ev) => formatCardNumber(ev.target.value)}
                    />

                    <Input
                        name='poo-photo'
                        required
                        className="proof-of-ownership__card-open-inputs-photo"
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
        </>

    )
}

export default ExpandedCard;
