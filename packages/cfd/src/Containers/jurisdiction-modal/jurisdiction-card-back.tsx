import { Icon, Text } from '@deriv/components';
import classNames from 'classnames';
import { jurisdiction_verification_contents } from 'Constants/jurisdiction-verification-contents';
import { TJurisdictionCardBackProps } from 'Containers/props.types';
import React from 'react';

const JurisdictionCardBack = ({ card_classname, toggleCardFlip, verification_docs }: TJurisdictionCardBackProps) => (
    <div
        className={classNames(`${card_classname}__card-content-container`, `${card_classname}__card-flipped-container`)}
    >
        <div>
            <Icon
                onClick={toggleCardFlip}
                className='cfd-card-back-section-back-button'
                icon='IcBackButton'
                size={20}
            />
        </div>
        <Text as='div' size='xxs'>
            {jurisdiction_verification_contents.short_description}
        </Text>
        <div className={classNames('cfd-card-back-section-items-container', 'cfd-card-back-section-main')}>
            {verification_docs?.map(verification_item => (
                <div key={verification_item} className='cfd-card-back-section-items-sub-container'>
                    <div>
                        <Icon
                            icon={
                                jurisdiction_verification_contents.required_verification_docs[verification_item]?.icon
                            }
                        />
                    </div>
                    <Text as='span' size='xxs'>
                        {jurisdiction_verification_contents.required_verification_docs[verification_item]?.text}
                    </Text>
                </div>
            ))}
        </div>
        <div className='cfd-card-section-divider' />
        <div className='cfd-card-back-section-items-container'>
            {jurisdiction_verification_contents.status_references.map(status_item => (
                <div className='cfd-card-back-section-items-sub-container' key={status_item.color}>
                    <div>
                        <Icon icon={status_item.icon} />
                    </div>
                    <Text as='span' size='xxs'>
                        {status_item.text}
                    </Text>
                </div>
            ))}
        </div>
    </div>
);

export default JurisdictionCardBack;
