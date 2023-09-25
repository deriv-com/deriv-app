import React from 'react';
import { Text } from '@deriv/components';
import { TJurisdictionClickableDescriptionProps } from 'Containers/props.types';

const JurisdictionClickableDescription = ({
    clickable_description,
    toggleCardFlip,
}: TJurisdictionClickableDescriptionProps) => (
    <div>
        {clickable_description.map(description_part => {
            const { type, text, onClick } = description_part;
            return type === 'link' ? (
                <span key={text} onClick={onClick || toggleCardFlip}>
                    <Text
                        data-testid='dt_jurisdiction_clickable_description'
                        as='span'
                        size='xxs'
                        className='cfd-card-clickable-description-link'
                    >
                        {text}
                    </Text>
                    &nbsp;
                </span>
            ) : (
                <Text key={text} as='span' size='xxs'>
                    {text}
                </Text>
            );
        })}
    </div>
);

export default JurisdictionClickableDescription;
