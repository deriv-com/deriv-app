import { Text } from '@deriv/components';
import classNames from 'classnames';
import React from 'react';
import { TJurisdictionCardSectionTitleIndicators } from 'Components/props.types';
import { TJurisdictionCardSectionProps } from '../props.types';

const JurisdictionCardSection = ({ cardSectionItem }: TJurisdictionCardSectionProps) => {
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
                return null;
            default:
                return null;
        }
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

            {cardSectionItem.description && (
                <Text as='span' size='xxs'>
                    {cardSectionItem.description}
                </Text>
            )}
        </div>
    );
};

export default JurisdictionCardSection;
