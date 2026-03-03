import React from 'react';

import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

import { TAX_RESIDENCE_JUSTIFICATION_OPTIONS } from './tax-info-options-list';

import './tax-info-modal.scss';

const MAX_REASON_LENGTH = 100;

type TTaxResidenceJustificationProps = {
    selected_key: string;
    other_reason: string;
    onSelect: (key: string) => void;
    onOtherReasonChange: (value: string) => void;
};

const TaxResidenceJustification = ({
    selected_key,
    other_reason,
    onSelect,
    onOtherReasonChange,
}: TTaxResidenceJustificationProps) => {
    return (
        <div>
            <div className='tax-info-modal__mismatch-info'>
                <Text size='s'>
                    <Localize i18n_default_text="Your country of tax residence doesn't match your country of residence. Please tell us why." />
                </Text>
            </div>
            <div className='tax-info-modal__options-list'>
                {TAX_RESIDENCE_JUSTIFICATION_OPTIONS.map(option => {
                    const is_selected = selected_key === option.key;
                    return (
                        <React.Fragment key={option.key}>
                            <div
                                className={`tax-info-modal__option-item${is_selected ? ' tax-info-modal__option-item--selected' : ''}`}
                                onClick={() => onSelect(option.key)}
                                role='button'
                                tabIndex={0}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        onSelect(option.key);
                                    }
                                }}
                            >
                                <Text size='s'>
                                    {option.is_other ? <Localize i18n_default_text='Other' /> : option.value}
                                </Text>
                            </div>
                            {is_selected && option.is_other && (
                                <div className='tax-info-modal__textarea tax-info-modal__bottom-margin'>
                                    <Text size='xs' weight='bold'>
                                        <Localize i18n_default_text='Specify your reason' />
                                    </Text>
                                    <textarea
                                        maxLength={MAX_REASON_LENGTH}
                                        value={other_reason}
                                        onChange={e => onOtherReasonChange(e.target.value)}
                                        placeholder=''
                                    />
                                    <div className='tax-info-modal__textarea-counter'>
                                        <Text size='xxxs' color='less-prominent'>
                                            {other_reason.length}/{MAX_REASON_LENGTH}
                                        </Text>
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default TaxResidenceJustification;
