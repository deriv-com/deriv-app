import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FileUploader from './FileUploader.jsx';
import { Input, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import SampleCreditCardModal from 'Components/sample-credit-card-modal';
import classNames from 'classnames';

const ExpandedCard = ({
    card_details,
    values,
    setFieldValue,
    index,
    error,
    validateField,
    updateErrors,
    show_browse_button,
    updateShowBrowseButton,
}) => {
    const [is_sample_modal_open, setIsSampleModalOpen] = useState(false);
    const controls_to_show = [...Array(card_details?.documents_required).keys()];
    const handleUploadedFile = (name, file) => {
        setFieldValue(name, file);
    };
    const handleBlur = (name, payment_method_identifier) => {
        handleIdentifierChange(name, formatIdentifier(payment_method_identifier, card_details?.icon));
    };
    const handleIdentifierChange = (name, payment_method_identifier) => {
        setFieldValue(name, payment_method_identifier);
    };
    const exampleLink = () =>
        ['IcVisaLight', 'IcMasterCardLight', 'IcVisaDark', 'IcMasterCardDark'].some(
            icon => icon === card_details?.icon
        ) ? (
            <span
                className='proof-of-ownership__card-open-desc-link'
                key={0}
                onClick={() => {
                    setIsSampleModalOpen(true);
                }}
            >
                {localize('See example')}
            </span>
        ) : (
            ''
        );
    const formatIdentifier = (id, type) => {
        let formatted_id = id;
        if (
            id &&
            ['IcCreditCard', 'IcVisaLight', 'IcMasterCardLight', 'IcVisaDark', 'IcMasterCardDark'].some(s => s === type)
        )
            formatted_id = `${id.substr(0, 6)}XXXXXX${id.substr(12)}`;
        else if (type === 'IcEwallet') return formatted_id;
        return formatted_id.replace(/\s/g, '').replace(/(\w{4})/g, '$1 ');
    };
    return (
        <>
            <div>
                {card_details?.instructions?.map(instruction => (
                    <Text
                        className='proof-of-ownership__card-open-desc'
                        as='p'
                        color='general'
                        size='xs'
                        key={instruction?.key ?? instruction}
                    >
                        {instruction} {exampleLink()}
                    </Text>
                ))}
                <fieldset>
                    <div className='proof-of-ownership__card-open-inputs'>
                        {card_details?.input_label && (
                            <div className='proof-of-ownership__card-open-inputs-field'>
                                <Input
                                    label={card_details?.input_label}
                                    data-lpignore='true'
                                    className='proof-of-ownership__card-open-inputs-cardnumber text-white'
                                    type='text'
                                    onChange={e => {
                                        handleIdentifierChange(
                                            `data[${index}].payment_method_identifier`,
                                            e.currentTarget.value
                                        );
                                    }}
                                    value={values?.data?.[index]?.payment_method_identifier}
                                    onBlur={e => {
                                        handleBlur(`data[${index}].payment_method_identifier`, e.currentTarget.value);
                                    }}
                                    data-testid='payment_method_identifier'
                                    error={error?.payment_method_identifier}
                                />
                            </div>
                        )}
                        {controls_to_show.map(i => (
                            // Using control_index Headers, because I have no unique value to use as a key
                            <React.Fragment key={`${i}${card_details?.id}}`}>
                                <div
                                    className={classNames('proof-of-ownership__card-open-inputs-upload', {
                                        expand: !card_details?.input_label,
                                        organise: card_details?.input_label !== null,
                                    })}
                                >
                                    <FileUploader
                                        handleFile={handleUploadedFile}
                                        file_name={values?.data?.[index]?.files?.[i]?.name ?? ''}
                                        data_test_id={'uploader-field'}
                                        class_name='proof-of-ownership__card-open-inputs-photo'
                                        name={`data[${index}].files[${i}]`}
                                        error={error?.files?.[i]}
                                        validateField={validateField}
                                        index={index}
                                        sub_index={i}
                                        updateErrors={updateErrors}
                                        show_browse_button={
                                            typeof show_browse_button[i] === 'boolean' ? show_browse_button[i] : true
                                        }
                                        updateShowBrowseButton={updateShowBrowseButton}
                                    />
                                </div>
                            </React.Fragment>
                        ))}
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

ExpandedCard.propTypes = {
    card_details: PropTypes.object,
    values: PropTypes.object,
    setFieldValue: PropTypes.func,
    index: PropTypes.number,
    error: PropTypes.object,
    validateField: PropTypes.func,
    updateErrors: PropTypes.func,
    show_browse_button: PropTypes.array,
    updateShowBrowseButton: PropTypes.func,
};

export default ExpandedCard;
