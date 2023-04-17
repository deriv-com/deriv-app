import classNames from 'classnames';
import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { TJurisdictionCardFrontProps } from 'Containers/props.types';
import JurisdictionCardSection from './jurisdiction-card-section';

const JurisdictionCardFront = ({
    card_classname,
    toggleCardFlip,
    card_values,
    card_data,
    is_card_selected,
    disabled,
}: TJurisdictionCardFrontProps) => (
    <div
        className={classNames(
            card_classname,
            'cfd-card-front',
            {
                [`${card_classname}--selected selected-card`]: is_card_selected,
            },
            { 'cfd-card-disabled-flat': disabled }
        )}
    >
        <div className={`${card_classname}__card-content-container`}>
            {card_values.is_over_header_available ? (
                <Text
                    as='div'
                    weight='bold'
                    color='info-blue'
                    align='center'
                    size='xs'
                    className={`${card_classname}__card-content-over-header`}
                >
                    <Localize i18n_default_text={card_values.over_header} />
                </Text>
            ) : (
                <div className={`${card_classname}__card-content-over-header-blank`} />
            )}
            <Text
                as='p'
                weight='bold'
                color='prominent'
                align='center'
                size='xsm'
                className={`${card_classname}__h2-header`}
            >
                <Localize i18n_default_text={card_values.header} />
            </Text>
            <div className={`${card_classname}__card-section-container`}>
                {card_data.map((item, index) => (
                    <React.Fragment key={item.key}>
                        <JurisdictionCardSection card_section_item={item} toggleCardFlip={toggleCardFlip} />
                        {index < card_data.length - 1 && <div className='cfd-card-section-divider' />}
                    </React.Fragment>
                ))}
            </div>
        </div>
        {disabled && (
            <div className={`${card_classname}__card-content-footer`}>
                <div className={`${card_classname}__card-content-footer-gradient`} />
                <Text
                    as='div'
                    weight='bold'
                    color='white'
                    align='center'
                    size='xs'
                    className={`${card_classname}__card-content-footer-text`}
                >
                    <Localize i18n_default_text='Added' />
                </Text>
            </div>
        )}
    </div>
);

export default JurisdictionCardFront;
