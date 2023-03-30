import { Text, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import classNames from 'classnames';
import React, { useState } from 'react';
import { jurisdiction_contents, jurisdiction_verification_contents } from '../../Constants/jurisdiction-contents';
import { TJurisdictionCardProps } from '../props.types';
import JurisdictionCardSection from './jurisdiction-card-section';

const JurisdictionCard = ({
    account_type,
    disabled,
    context,
    jurisdiction_selected_shortcode,
    financial_available_accounts,
    setJurisdictionSelectedShortcode,
    synthetic_available_accounts,
    type_of_card,
}: TJurisdictionCardProps) => {
    const card_classname = `cfd-jurisdiction-card--${account_type}`;
    const is_synthetic = account_type === 'synthetic';
    const card_values = jurisdiction_contents[type_of_card as keyof typeof jurisdiction_contents];
    const card_data = is_synthetic ? card_values.synthetic_contents : card_values.financial_contents;
    const verification_docs = is_synthetic
        ? card_values?.synthetic_verification_docs
        : card_values.financial_verification_docs;
    const [isCardFlipped, setIsCardFlipped] = useState(false);

    const cardSelection = (cardType: string) => {
        setJurisdictionSelectedShortcode(jurisdiction_selected_shortcode === cardType ? '' : cardType);
    };

    const flipCard = () => {
        setIsCardFlipped(!isCardFlipped);
    };

    return (
        <div
            className={classNames(card_classname, {
                [`${card_classname}--selected selected-card`]: jurisdiction_selected_shortcode === type_of_card,
            })}
            onClick={disabled || isCardFlipped ? () => undefined : () => cardSelection(type_of_card)}
        >
            {isCardFlipped ? (
                <div
                    className={classNames(
                        `${card_classname}__card-content-container`,
                        `${card_classname}__card-flipped-container`
                    )}
                >
                    <div>
                        <Icon onClick={flipCard} icon='IcBackButton' size={20} />
                    </div>
                    <Text as='div' size='xxs'>
                        {jurisdiction_verification_contents.shortDescription}
                    </Text>
                    <div className={classNames('cfd-card-back-section-items-container', 'cfd-card-back-section-main')}>
                        {verification_docs?.map(verificationItem => (
                            <div className='cfd-card-back-section-items-sub-container' key={verificationItem}>
                                <div>
                                    <Icon
                                        icon={
                                            jurisdiction_verification_contents.requiredVerificationDocs[
                                                verificationItem
                                            ]?.icon
                                        }
                                    />
                                </div>
                                <Text as='span' size='xxs'>
                                    {
                                        jurisdiction_verification_contents.requiredVerificationDocs[verificationItem]
                                            ?.text
                                    }
                                </Text>
                            </div>
                        ))}
                    </div>
                    <div className='cfd-card-section-divider' />
                    <div className='cfd-card-back-section-items-container'>
                        {jurisdiction_verification_contents.statusReferences.map(statusItem => (
                            <div className='cfd-card-back-section-items-sub-container' key={statusItem.color}>
                                <div>
                                    <Icon icon={statusItem.icon} />
                                </div>
                                <Text as='span' size='xxs'>
                                    {statusItem.text}
                                </Text>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={`${card_classname}__card-content-container`}>
                    {card_values.is_over_header_available ? (
                        <Text as='div' size='xxs' className={`${card_classname}__card-content-over-header`}>
                            <Localize i18n_default_text={card_values.over_header} />
                        </Text>
                    ) : (
                        <div className={`${card_classname}__card-content-over-header-blank`} />
                    )}
                    <Text as='p' color={'prominent'} weight='bold' size='sm' className={`${card_classname}__h2-header`}>
                        <Localize i18n_default_text={card_values.header} />
                    </Text>
                    <div className={`${card_classname}__card-section-container`}>
                        {card_data.map((item, index) => (
                            <React.Fragment key={item.key}>
                                <JurisdictionCardSection cardSectionItem={item} flipCard={flipCard} />
                                {index < card_data.length - 1 && <div className='cfd-card-section-divider' />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JurisdictionCard;
