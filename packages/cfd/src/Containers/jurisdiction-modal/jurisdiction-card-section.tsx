import { Text } from '@deriv/components';
import classNames from 'classnames';
import React, { SyntheticEvent } from 'react';
import { TClickableDescription, TJurisdictionCardSectionTitleIndicators } from 'Components/props.types';
import { TJurisdictionCardSectionProps } from '../props.types';

const JurisdictionCardSection = ({ cardSectionItem, flipCard }: TJurisdictionCardSectionProps) => {
    const handleCardFlip = (event: SyntheticEvent) => {
        event.stopPropagation();
        flipCard();
    };

    const renderTitleIndicator = (titleIndicators: TJurisdictionCardSectionTitleIndicators) => {
        switch (titleIndicators.type) {
            case 'displayText':
                return (
                    <div
                        className={classNames(
                            'cfd-card-section-title-indicator',
                            `cfd-card-section-title-indicator__${titleIndicators.displayTextSkinColor}`
                        )}
                    >
                        {titleIndicators.displayText}
                    </div>
                );
            case 'displayIcons':
                return '';
            default:
                return '';
        }
    };

    const renderClickableDescription = (clickableDescription: Array<TClickableDescription>) => {
        return clickableDescription.map(descriptionPart => {
            switch (descriptionPart.type) {
                case 'link':
                    return (
                        <span onClick={event => handleCardFlip(event)}>
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
                {cardSectionItem.titleIndicators && renderTitleIndicator(cardSectionItem.titleIndicators)}
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
