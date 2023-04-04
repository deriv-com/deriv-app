import { Text } from '@deriv/components';
import { TClickableDescription } from 'Components/props.types';
import React from 'react';
import { TJurisdictionCardSectionProps } from '../props.types';
import JurisdictionTitleIndicator from './jurisdiction-title-indicator';

const JurisdictionCardSection = ({ cardSectionItem, toggleCardFlip }: TJurisdictionCardSectionProps) => {
    const renderClickableDescription = (clickableDescription: Array<TClickableDescription>) => {
        return clickableDescription.map(descriptionPart => {
            switch (descriptionPart.type) {
                case 'link':
                    return (
                        <span onClick={toggleCardFlip}>
                            <Text as='span' size='xxs' className='clickable-description-link'>
                                {descriptionPart.text}
                            </Text>
                            &nbsp;
                        </span>
                    );
                case 'text':
                    return (
                        <Text as='span' size='xxs'>
                            {descriptionPart.text}
                        </Text>
                    );
                default:
                    return '';
            }
        });
    };

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
                <div>{renderClickableDescription(cardSectionItem.clickableDescription)}</div>
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
