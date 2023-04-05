import { Text } from '@deriv/components';
import React from 'react';
import { TJurisdictionCardSectionProps } from '../props.types';
import JurisdictionClickableDescription from './jurisdiction-clickable-description';
import JurisdictionTitleIndicator from './jurisdiction-title-indicator';

const JurisdictionCardSection = ({ cardSectionItem, toggleCardFlip }: TJurisdictionCardSectionProps) => {
    return (
        <div className='cfd-card-section'>
            <div className='cfd-card-title-container'>
                <div className='cfd-card-title'>
                    <Text as='span' weight='bold' size='xs'>
                        {cardSectionItem.title}
                    </Text>
                </div>
                {cardSectionItem.titleIndicators && (
                    <JurisdictionTitleIndicator title_indicators={cardSectionItem.titleIndicators} />
                )}
            </div>
            {cardSectionItem.clickableDescription ? (
                <JurisdictionClickableDescription
                    clickable_description={cardSectionItem.clickableDescription}
                    toggleCardFlip={toggleCardFlip}
                />
            ) : (
                cardSectionItem.description && (
                    <Text as='span' size='xxs'>
                        {cardSectionItem.description}
                    </Text>
                )
            )}
        </div>
    );
};

export default JurisdictionCardSection;
