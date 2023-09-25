import classNames from 'classnames';
import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { TJurisdictionCardFrontProps } from 'Containers/props.types';
import JurisdictionCardSection from './jurisdiction-card-section';

const JurisdictionCardFront = ({
    account_status,
    card_classname,
    card_data,
    card_values,
    disabled,
    is_card_selected,
    toggleCardFlip,
    type_of_card,
    verification_docs,
}: TJurisdictionCardFrontProps) => (
    <div
        className={classNames(card_classname, 'cfd-card-front', {
            [`${card_classname}--selected selected-card`]: is_card_selected,
            'cfd-card-disabled-flat': disabled,
        })}
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
                        <JurisdictionCardSection
                            account_status={account_status}
                            card_section_item={item}
                            toggleCardFlip={toggleCardFlip}
                            type_of_card={type_of_card}
                            verification_docs={verification_docs}
                        />
                        {index < card_data.length - 1 && <div className='cfd-card-section-divider' />}
                    </React.Fragment>
                ))}
            </div>
            {disabled && (
                <div className={`${card_classname}__card-content-footer`}>
                    <Text
                        as='div'
                        weight='bold'
                        color='colored-background'
                        align='center'
                        size='xs'
                        className={`${card_classname}__card-content-footer-text`}
                    >
                        <Localize i18n_default_text='Added' />
                    </Text>
                </div>
            )}
        </div>
    </div>
);

export default JurisdictionCardFront;
