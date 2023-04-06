import { Text } from '@deriv/components';
import React from 'react';
import { TJurisdictionCardSectionProps } from '../props.types';
import JurisdictionClickableDescription from './jurisdiction-clickable-description';
import JurisdictionTitleIndicator from './jurisdiction-title-indicator';

const JurisdictionCardSection = ({ card_section_item, toggleCardFlip }: TJurisdictionCardSectionProps) => {
    return (
        <div className='cfd-card-section'>
            <div className='cfd-card-title-container'>
                <Text as='span' weight='bold' size='xs'>
                    {card_section_item.title}
                </Text>
                {card_section_item.title_indicators && (
                    <JurisdictionTitleIndicator title_indicators={card_section_item.title_indicators} />
                )}
            </div>
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
    );
};

export default JurisdictionCardSection;
