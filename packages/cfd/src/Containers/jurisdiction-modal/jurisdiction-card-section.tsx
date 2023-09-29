import React from 'react';
import { Text } from '@deriv/components';
import { TJurisdictionCardSectionProps } from '../props.types';
import JurisdictionClickableDescription from './jurisdiction-clickable-description';
import JurisdictionTitleIndicator from './jurisdiction-title-indicator';

const JurisdictionCardSection = ({
    account_status,
    card_section_item,
    toggleCardFlip,
    type_of_card,
    verification_docs,
}: TJurisdictionCardSectionProps) => (
    <div className='cfd-card-section'>
        <div className='cfd-card-title-container'>
            <Text as='span' weight='bold' size='xs'>
                {card_section_item.title}
            </Text>
            {card_section_item.title_indicators && (
                <JurisdictionTitleIndicator
                    account_status={account_status}
                    title_indicators={card_section_item.title_indicators}
                    type_of_card={type_of_card}
                    verification_docs={verification_docs}
                />
            )}
        </div>
        {(card_section_item.clickable_description || card_section_item.description) && (
            <div className={`cfd-card-section-description-height-${card_section_item.key.toLowerCase()}`}>
                {card_section_item.clickable_description ? (
                    <JurisdictionClickableDescription
                        clickable_description={card_section_item.clickable_description}
                        toggleCardFlip={toggleCardFlip}
                    />
                ) : (
                    card_section_item.description && (
                        <Text as='span' size='xxs'>
                            {card_section_item.description}
                        </Text>
                    )
                )}
            </div>
        )}
    </div>
);

export default JurisdictionCardSection;
