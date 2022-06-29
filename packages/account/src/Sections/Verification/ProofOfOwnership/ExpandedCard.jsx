import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FileUploader from './FileUploader.jsx';
import { Input, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import SampleCreditCardModal from 'Components/sample-credit-card-modal';
import classNames from 'classnames';

const ExpandedCard = ({
    card_details,
    handleChange,
    handleBlur,
    identifier,
    values,
    setFieldValue,
    index,
    error,
    validateField,
}) => {
    const [is_sample_modal_open, setIsSampleModalOpen] = useState(false);
    const controls_to_show = [...Array(card_details?.documents_required).keys()];
    const handleUploadedFile = (name, file) => {
        setFieldValue(name, file);
    };

    const exampleLink = () =>
        ['IcCreditCard', 'IcStockVisa', 'IcStockMasterCard'].some(icon => icon === card_details.icon) && (
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

    const formatIdentifier = (id, type) => {
        let formatted_id = id;
        if (['IcCreditCard', 'IcStockVisa', 'IcStockMasterCard'].some(s => s === type))
            formatted_id = `${id.substr(0, 6)}XXXXXX${id.substr(12)}`;
        else if (type === 'IcEwallet') return formatted_id;
        return formatted_id
            .replace(/\s/g, '')
            .replace(/(\w{4})/g, '$1 ')
            .trim();
    };

    return (
        <>
            <div>
                {card_details.paragraphs.map((para, idx) => (
                    <Text className='proof-of-ownership__card-open-desc' as='p' color='general' size='xs' key={idx}>
                        {para} {exampleLink()}
                    </Text>
                ))}
                <fieldset>
                    <div className='proof-of-ownership__card-open-inputs'>
                        {card_details.input_label && card_details.icon !== 'IcCreditCard' && (
                            <div className='proof-of-ownership__card-open-inputs-field'>
                                <Input
                                    label={card_details.input_label}
                                    data-lpignore='true'
                                    className='proof-of-ownership__card-open-inputs-cardnumber'
                                    type='text'
                                    onChange={handleChange}
                                    disabled
                                    value={formatIdentifier(identifier, card_details.icon)}
                                    onBlur={handleBlur}
                                    maxLength='19'
                                />
                            </div>
                        )}
                        {controls_to_show.map(i => (
                            <React.Fragment key={i}>
                                {/* Used React.Fragment instead of the <></> to resolve devtools console errors/warnings of missing key prop. */}
                                {card_details.icon === 'IcCreditCard' && (
                                    <div className='proof-of-ownership__card-open-inputs-field' key={i}>
                                        <Input
                                            label={card_details.input_label}
                                            data-lpignore='true'
                                            className='proof-of-ownership__card-open-inputs-cardnumber'
                                            type='text'
                                            onChange={handleChange}
                                            disabled
                                            value={formatIdentifier(identifier, card_details.icon)}
                                            onBlur={handleBlur}
                                            maxLength='19'
                                            data-datatestid='identifier'
                                        />
                                    </div>
                                )}
                                <div
                                    className={classNames('proof-of-ownership__card-open-inputs-upload', {
                                        expand: !card_details.input_label,
                                        organise: card_details.input_label !== null,
                                    })}
                                >
                                    <FileUploader
                                        handleFile={handleUploadedFile}
                                        fileName={values?.data?.[index]?.files[i]?.file?.name}
                                        data-datatestid={`uploader-${values?.data?.[index]?.files[i]?.id}`}
                                        className='proof-of-ownership__card-open-inputs-photo'
                                        name={`data[${index}].files[${i}].file`}
                                        error={error?.files[i]?.file}
                                        validateField={validateField}
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
    handleChange: PropTypes.func,
    handleBlur: PropTypes.func,
    identifier: PropTypes.string,
    values: PropTypes.object,
    setFieldValue: PropTypes.func,
    index: PropTypes.number,
    error: PropTypes.object,
    validateField: PropTypes.func,
};

export default ExpandedCard;
