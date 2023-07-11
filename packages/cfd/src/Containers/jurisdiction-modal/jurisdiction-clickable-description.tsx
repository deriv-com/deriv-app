import React from 'react';
import { Text } from '@deriv/components';
import { TJurisdictionClickableDescriptionProps } from 'Containers/props.types';

const JurisdictionClickableDescription = ({
    clickable_description,
    toggleCardFlip,
}: TJurisdictionClickableDescriptionProps) => (
    <div>
        {clickable_description.map(description_part => {
            return description_part.type === 'link' ? (
                <span key={description_part.text} onClick={toggleCardFlip}>
                    <Text
                        data-testid='dt_jurisdiction_clickable_description'
                        as='span'
                        size='xxs'
                        className='cfd-card-clickable-description-link'
                    >
                        {description_part.text}
                    </Text>
                    &nbsp;
                </span>
            ) : (
                <Text key={description_part.text} as='span' size='xxs'>
                    {description_part.text}
                </Text>
            );
        })}
    </div>
);

export default JurisdictionClickableDescription;
