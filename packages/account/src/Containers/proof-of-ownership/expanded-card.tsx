import React from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { Input, Text } from '@deriv/components';
import { IDENTIFIER_TYPES, VALIDATIONS } from '../../Constants/poo-identifier';
import FileUploader from '../../Sections/Verification/ProofOfOwnership/file-uploader';
import { TPaymentMethodInfo } from '../../Types';
import ExampleLink from './example-link';

type TExpandedCardProps = {
    card_details: TPaymentMethodInfo;
    index: number;
    updateErrors: (index: number, item_index: number, sub_index: number) => void;
};

/**
 *
 * @param card_details Details of payment method
 * @param index Index of payment method
 * @param updateErrors Function to update errors
 * @returns React Component
 */
const ExpandedCard = ({ card_details, index, updateErrors }: TExpandedCardProps) => {
    const { values, setFieldValue, errors } = useFormikContext();

    const handleUploadedFile = async (name: string, file: Blob) => {
        await setFieldValue(name, file);
    };
    const handleBlur = (
        name: string,
        payment_method_identifier: string,
        identifier_type: string,
        item_id: string,
        item_index: number,
        documents_required: number
    ) => {
        handleIdentifierChange(
            name,
            formatIdentifier(payment_method_identifier, identifier_type),
            item_id,
            item_index,
            documents_required
        );
    };
    const handleIdentifierChange = (
        name: string,
        payment_method_identifier: string,
        item_id: string,
        item_index: number,
        documents_required: number
    ) => {
        setFieldValue(`${name}`, {
            ...values.data?.[index]?.[item_index],
            documents_required,
            id: item_id,
            payment_method_identifier,
            is_generic_pm: card_details.is_generic_pm,
            identifier_type: card_details.identifier_type,
        });
    };

    const formatIdentifier = (payment_method_identifier: string, identifier_type: string) => {
        let formatted_id = payment_method_identifier?.replace(/\s/g, '') || '';
        if (identifier_type === IDENTIFIER_TYPES.CARD_NUMBER) {
            if (
                formatted_id.length !== 16 ||
                (formatted_id.length === 16 && VALIDATIONS.hasInvalidCharacters(formatted_id))
            ) {
                return formatted_id;
            }
            formatted_id = `${formatted_id.substring(0, 6)}XXXXXX${formatted_id.substring(12)}`;
        } else if ([IDENTIFIER_TYPES.EMAIL_ADDRESS, IDENTIFIER_TYPES.USER_ID].some(s => s === identifier_type)) {
            return formatted_id;
        }
        return formatted_id.replace(/(\w{4})/g, '$1 ').trim();
    };
    const isSpecialPM = (pm_icon: string) =>
        ['IcOnlineNaira', 'IcAstroPayLight', 'IcAstroPayDark'].some(ic => ic === pm_icon);

    return (
        <React.Fragment>
            <div>
                {card_details?.instructions?.map(instruction => (
                    <Text
                        className='proof-of-ownership__card-open-desc'
                        as='p'
                        color='general'
                        size='xs'
                        key={instruction?.key ?? instruction}
                    >
                        {instruction}{' '}
                        {card_details?.identifier_type === IDENTIFIER_TYPES.CARD_NUMBER && <ExampleLink />}
                    </Text>
                ))}
                <fieldset>
                    {card_details?.items &&
                        card_details?.items.map((item, item_index) => {
                            const controls_to_show = [...Array(item?.documents_required).keys()];
                            return (
                                <div className='proof-of-ownership__card-open-inputs' key={`${item_index}-${item.id}`}>
                                    {card_details?.input_label && isSpecialPM(card_details?.icon) && (
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
                                                            !errors?.[item_index]?.payment_method_identifier,
                                                    }
                                                )}
                                                type='text'
                                                onChange={e => {
                                                    handleIdentifierChange(
                                                        `data[${index}].[${item_index}]`,
                                                        e.currentTarget.value.trim(),
                                                        item.id,
                                                        item_index,
                                                        card_details.documents_required
                                                    );
                                                }}
                                                value={
                                                    values?.data?.[index]?.[item_index]?.payment_method_identifier || ''
                                                }
                                                onBlur={e => {
                                                    handleBlur(
                                                        `data[${index}].[${item_index}]`,
                                                        e.currentTarget.value.trim(),
                                                        card_details?.identifier_type,
                                                        item.id,
                                                        item_index,
                                                        card_details.documents_required
                                                    );
                                                }}
                                                data-testid='dt_payment_method_identifier'
                                                error={errors?.[item_index]?.payment_method_identifier}
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
                                                                    !errors?.[item_index]?.payment_method_identifier,
                                                            }
                                                        )}
                                                        type='text'
                                                        onChange={e => {
                                                            handleIdentifierChange(
                                                                `data[${index}].[${item_index}]`,
                                                                e.currentTarget.value.trim(),
                                                                item.id,
                                                                item_index,
                                                                card_details.documents_required
                                                            );
                                                        }}
                                                        value={
                                                            values?.data?.[index]?.[item_index]
                                                                ?.payment_method_identifier ?? ''
                                                        }
                                                        onBlur={e => {
                                                            handleBlur(
                                                                `data[${index}].[${item_index}]`,
                                                                e.currentTarget.value.trim(),
                                                                card_details?.identifier_type,
                                                                item.id,
                                                                item_index,
                                                                card_details.documents_required
                                                            );
                                                        }}
                                                        data-testid='dt_payment_method_identifier'
                                                        error={errors?.[item_index]?.payment_method_identifier}
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
                                                    file_name={
                                                        values?.data?.[index]?.[item_index]?.files?.[i]?.name ?? ''
                                                    }
                                                    class_name='proof-of-ownership__card-open-inputs-photo'
                                                    name={`data[${index}].[${item_index}].files[${i}]`}
                                                    error={errors?.[item_index]?.files?.[i]}
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
        </React.Fragment>
    );
};

export default ExpandedCard;
