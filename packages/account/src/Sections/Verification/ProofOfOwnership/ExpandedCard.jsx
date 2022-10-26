import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FileUploader from './FileUploader.jsx';
import { Input, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import SampleCreditCardModal from 'Components/sample-credit-card-modal';
import classNames from 'classnames';
import { IDENTIFIER_TYPES, VALIDATIONS } from './constants/constants.js';

const ExpandedCard = ({
    card_details,
    error,
    index,
    setFieldValue,
    show_browse_button,
    updateErrors,
    updateShowBrowseButton,
    validateField,
    values,
}) => {
    const [is_sample_modal_open, setIsSampleModalOpen] = useState(false);
    const controls_to_show = [...Array(card_details?.documents_required).keys()];
    const handleUploadedFile = (name, file) => {
        setFieldValue(name, file);
    };
    const handleBlur = (name, payment_method_identifier) => {
        handleIdentifierChange(name, formatIdentifier(payment_method_identifier, card_details?.identifier_type));
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
    const formatIdentifier = (payment_method_identifier, identifier_type) => {
        let formatted_id = payment_method_identifier?.replace(/\s/g, '') ?? '';
        if (identifier_type === IDENTIFIER_TYPES.card_number) {
            if (
                formatted_id.length !== 16 ||
                (formatted_id.length === 16 && VALIDATIONS.has_invalid_characters.test(formatted_id))
            ) {
                return formatted_id;
            }
            formatted_id = `${formatted_id.substring(0, 6)}XXXXXX${formatted_id.substring(12)}`;
        } else if ([IDENTIFIER_TYPES.email_address, IDENTIFIER_TYPES.user_id].some(s => s === identifier_type)) {
            return formatted_id;
        }
        return formatted_id.replace(/(\w{4})/g, '$1 ').trim();
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
    error: PropTypes.object,
    index: PropTypes.number,
    setFieldValue: PropTypes.func,
    show_browse_button: PropTypes.array,
    updateErrors: PropTypes.func,
    updateShowBrowseButton: PropTypes.func,
    validateField: PropTypes.func,
    values: PropTypes.object,
};

export default ExpandedCard;
