import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { TJurisdictionCardSectionProps } from '../props.types';
import { TJurisdictionCardSectionTitleIndicators } from 'Components/props.types';
import classNames from 'classnames';

const JurisdictionCardSection = ({ cardSectionItem }: TJurisdictionCardSectionProps) => {
    const renderTitleIndicator=(titleIndicators: TJurisdictionCardSectionTitleIndicators) =>{
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
    }

    return (
        <div className='cfd-card-section'>
            <div className='cfd-card-title-container'>
                <div className='cfd-card-title'>
                    <Text as='span' weight='bold' size='xs'>
                        <Localize i18n_default_text={cardSectionItem.title} />
                    </Text>
                </div>
                {cardSectionItem.titleIndicators && renderTitleIndicator(cardSectionItem.titleIndicators)}
            </div>

            {cardSectionItem.description && (
                <Text as='span' size='xxs'>
                    <Localize i18n_default_text={cardSectionItem.description} />
                </Text>
            )}
        </div>
    );
};

export default JurisdictionCardSection;
