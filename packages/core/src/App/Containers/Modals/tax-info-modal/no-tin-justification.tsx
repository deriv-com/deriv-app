import React from 'react';

import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

import { NO_TIN_JUSTIFICATION_OPTIONS } from './tax-info-options-list';

import './tax-info-modal.scss';

const MAX_REASON_LENGTH = 100;

type TNoTinJustificationProps = {
    selected_key: string;
    other_reason: string;
    onSelect: (key: string) => void;
    onOtherReasonChange: (value: string) => void;
};

const NoTinJustification = ({
    selected_key,
    other_reason,
    onSelect,
    onOtherReasonChange,
}: TNoTinJustificationProps) => {
    return (
        <div>
            <hr className='tax-info-modal__divider' />
            <Text size='xs' color='less-prominent' className='tax-info-modal__no-tin-header'>
                <Localize i18n_default_text="Tell us why you don't have a tax identification number (TIN)." />
            </Text>
            <div className='tax-info-modal__options-list'>
                {NO_TIN_JUSTIFICATION_OPTIONS.map(option => {
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
                                    {option.is_other ? (
                                        <Localize i18n_default_text='I am otherwise unable to obtain a TIN or equivalent, and will provide further explanation.' />
                                    ) : (
                                        option.value
                                    )}
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

export default NoTinJustification;
