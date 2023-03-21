import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import classNames from 'classnames';
import React from 'react';
import { jurisdiction_contents } from '../../Constants/jurisdiction-contents';
import { TJurisdictionCardProps } from '../props.types';
import JurisdictionCardSection from './jurisdiction-card-section';

const JurisdictionCard = ({
    account_type,
    disabled,
    context,
    jurisdiction_selected_shortcode,
    financial_available_accounts,
    setJurisdictionSelectedShortcode,
    synthetic_available_accounts,
    type_of_card,
}: TJurisdictionCardProps) => {
    const card_classname = `cfd-jurisdiction-card--${account_type}`;
    const is_synthetic = account_type === 'synthetic';
    const card_values = jurisdiction_contents[type_of_card as keyof typeof jurisdiction_contents];
    const card_data = is_synthetic ? card_values.synthetic_contents : card_values.financial_contents;

    const cardSelection = (cardType: string) => {
        setJurisdictionSelectedShortcode(jurisdiction_selected_shortcode === cardType ? '' : cardType);
    };

    return (
        <React.Fragment>
            <div
                className={classNames(card_classname, {
                    [`${card_classname}--selected selected-card`]: jurisdiction_selected_shortcode === type_of_card,
                })}
                onClick={disabled ? () => undefined : () => cardSelection(type_of_card)}
            >
                <div className={`${card_classname}__card-content-container`}>
                    {card_values.is_over_header_available ? (
                        <div className={`${card_classname}__card-content-over-header`}>
                            <Localize i18n_default_text={card_values.over_header} />
                        </div>
                    ) : (
                        <div className={`${card_classname}__card-content-over-header-blank`} />
                    )}
                    <Text as='p' color={'prominent'} weight='bold' size='sm' className={`${card_classname}__h2-header`}>
                        <Localize i18n_default_text={card_values.header} />
                    </Text>
                    <div className={`${card_classname}__card-section-container`}>
                        {card_data.map((item, index) => (
                            <>
                                <JurisdictionCardSection key={index} cardSectionItem={item} />
                                {index < card_data.length - 1 && <div className='cfd-card-section-divider' /> }
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default JurisdictionCard;
