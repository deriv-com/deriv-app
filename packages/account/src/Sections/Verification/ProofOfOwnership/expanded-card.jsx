import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FileUploader from './file-uploader.jsx';
import { Input, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import SampleCreditCardModal from 'Components/sample-credit-card-modal';
import classNames from 'classnames';
import { IDENTIFIER_TYPES, VALIDATIONS } from './constants/constants.js';

const ExpandedCard = ({ card_details, error, index, setFieldValue, updateErrors, validateField, values }) => {
    const [is_sample_modal_open, setIsSampleModalOpen] = useState(false);
    const handleUploadedFile = (name, file) => {
        setFieldValue(name, file);
    };
    const handleBlur = (name, payment_method_identifier, item_id, item_index) => {
        handleIdentifierChange(
            name,
            formatIdentifier(payment_method_identifier, card_details?.identifier_type),
            item_id,
            item_index
        );
    };
    const handleIdentifierChange = (name, payment_method_identifier, item_id, item_index) => {
        setFieldValue(`${name}`, {
            ...values.data?.[index]?.[item_index],
            id: item_id,
            payment_method_identifier,
            is_generic_pm: card_details.is_generic_pm,
            identifier_type: card_details.identifier_type,
        });
    };
    const exampleLink = () =>
        card_details?.identifier_type === IDENTIFIER_TYPES.card_number && (
            <span
                className='proof-of-ownership__card-open-desc-link'
                key={0}
                onClick={() => {
                    setIsSampleModalOpen(true);
                }}
            >
                {localize('See example')}
            </span>
        );
    const formatIdentifier = (payment_method_identifier, identifier_type) => {
        let formatted_id = payment_method_identifier?.replace(/\s/g, '') || '';
        if (identifier_type === IDENTIFIER_TYPES.card_number) {
            if (
                formatted_id.length !== 16 ||
                (formatted_id.length === 16 && VALIDATIONS.has_invalid_characters(formatted_id))
            ) {
                return formatted_id;
            }
            formatted_id = `${formatted_id.substring(0, 6)}XXXXXX${formatted_id.substring(12)}`;
        } else if ([IDENTIFIER_TYPES.email_address, IDENTIFIER_TYPES.user_id].some(s => s === identifier_type)) {
            return formatted_id;
        }
        return formatted_id.replace(/(\w{4})/g, '$1 ').trim();
    };
    const isSpecialPM = pm_icon => ['IcOnlineNaira', 'IcAstroPayLight', 'IcAstroPayDark'].some(ic => ic === pm_icon);
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
                    {card_details.items.map((item, item_index) => {
                        const controls_to_show = [...Array(item?.documents_required).keys()];
                        return (
                            <div className='proof-of-ownership__card-open-inputs' key={`${item_index}-${item.id}`}>
                                {card_details?.input_label && isSpecialPM(card_details?.icon) && (
                                    <div className='proof-of-ownership__card-open-inputs-field'>
                                        <Input
                                            label={card_details?.input_label}
                                            data-lpignore='true'
                                            className={classNames('proof-of-ownership__card-open-inputs-cardnumber', {
                                                'proof-of-ownership-valid-identifier':
                                                    values?.data?.[index]?.[item_index]?.payment_method_identifier &&
                                                    !error?.[item_index]?.payment_method_identifier,
                                            })}
                                            type='text'
                                            onChange={e => {
                                                handleIdentifierChange(
                                                    `data[${index}].[${item_index}]`,
                                                    e.currentTarget.value.trim(),
                                                    item.id,
                                                    item_index
                                                );
                                            }}
                                            value={values?.data?.[index]?.[item_index]?.payment_method_identifier ?? ''}
                                            onBlur={e => {
                                                handleBlur(
                                                    `data[${index}].[${item_index}]`,
                                                    e.currentTarget.value.trim(),
                                                    item.id,
                                                    item_index
                                                );
                                            }}
                                            data-testid='dt_payment_method_identifier'
                                            error={error?.[item_index]?.payment_method_identifier}
                                        />
                                    </div>
                                )}
                                {controls_to_show.map(i => (
                                    <React.Fragment key={`${item?.id}-${i}`}>
                                        {card_details?.input_label && !isSpecialPM(card_details?.icon) && (
                                            <div className='proof-of-ownership__card-open-inputs-field'>
                                                <Input
                                                    label={card_details?.input_label}
                                                    data-lpignore='true'
                                                    className={classNames(
                                                        'proof-of-ownership__card-open-inputs-cardnumber',
                                                        {
                                                            'proof-of-ownership-valid-identifier':
                                                                values?.data?.[index]?.[item_index]
                                                                    ?.payment_method_identifier &&
                                                                !error?.[item_index]?.payment_method_identifier,
                                                        }
                                                    )}
                                                    type='text'
                                                    onChange={e => {
                                                        handleIdentifierChange(
                                                            `data[${index}].[${item_index}]`,
                                                            e.currentTarget.value,
                                                            item.id,
                                                            item_index
                                                        );
                                                    }}
                                                    value={
                                                        values?.data?.[index]?.[item_index]
                                                            ?.payment_method_identifier ?? ''
                                                    }
                                                    onBlur={e => {
                                                        handleBlur(
                                                            `data[${index}].[${item_index}]`,
                                                            e.currentTarget.value,
                                                            item.id,
                                                            item_index
                                                        );
                                                    }}
                                                    data-testid='dt_payment_method_identifier'
                                                    error={error?.[item_index]?.payment_method_identifier}
                                                />
                                            </div>
                                        )}
                                        <div
                                            className={classNames('proof-of-ownership__card-open-inputs-upload', {
                                                expand: !card_details?.input_label,
                                                organise: card_details?.input_label !== null,
                                            })}
                                        >
                                            <FileUploader
                                                handleFile={handleUploadedFile}
                                                file_name={values?.data?.[index]?.[item_index]?.files?.[i]?.name ?? ''}
                                                class_name='proof-of-ownership__card-open-inputs-photo'
                                                name={`data[${index}].[${item_index}].files[${i}]`}
                                                error={error?.[item_index]?.files?.[i]}
                                                validateField={validateField}
                                                index={index}
                                                item_index={item_index}
                                                sub_index={i}
                                                updateErrors={updateErrors}
                                            />
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        );
                    })}
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
    error: PropTypes.array,
    index: PropTypes.number,
    setFieldValue: PropTypes.func,
    updateErrors: PropTypes.func,
    validateField: PropTypes.func,
    values: PropTypes.object,
};

export default ExpandedCard;
