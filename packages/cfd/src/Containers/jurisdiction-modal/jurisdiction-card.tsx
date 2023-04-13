import classNames from 'classnames';
import React, { SyntheticEvent } from 'react';
import { getJurisdictionContents } from '../../Constants/jurisdiction-contents/jurisdiction-contents';
import { TJurisdictionCardProps } from '../props.types';
import JurisdictionCardBack from './jurisdiction-card-back';
import JurisdictionCardFront from './jurisdiction-card-front';

const JurisdictionCard = ({
    account_type,
    disabled,
    context,
    jurisdiction_selected_shortcode,
    financial_available_accounts,
    setJurisdictionSelectedShortcode,
    synthetic_available_accounts,
    type_of_card,
    card_flip_status,
    flipCard,
}: TJurisdictionCardProps) => {
    const card_classname = `cfd-jurisdiction-card--${account_type}`;
    const is_synthetic = account_type === 'synthetic';
    const card_values = getJurisdictionContents()[type_of_card];
    const card_data = is_synthetic ? card_values.synthetic_contents : card_values.financial_contents;
    const verification_docs = is_synthetic
        ? card_values?.synthetic_verification_docs
        : card_values?.financial_verification_docs;
    const is_card_flipped = card_flip_status[type_of_card];
    const cardSelection = (cardType: string) => {
        setJurisdictionSelectedShortcode(jurisdiction_selected_shortcode === cardType ? '' : cardType);
    };

    const toggleCardFlip = (event: SyntheticEvent) => {
        event.stopPropagation();
        flipCard(type_of_card);
    };

    return (
        <div
            className={classNames(card_classname, {
                [`${card_classname}--selected selected-card`]: jurisdiction_selected_shortcode === type_of_card,
            })}
            onClick={disabled ? () => undefined : () => cardSelection(type_of_card)}
        >
            {!is_card_flipped ? (
                <JurisdictionCardFront
                    card_classname={card_classname}
                    toggleCardFlip={toggleCardFlip}
                    card_values={card_values}
                    card_data={card_data}
                />
            ) : (
                <JurisdictionCardBack
                    card_classname={card_classname}
                    toggleCardFlip={toggleCardFlip}
                    verification_docs={verification_docs}
                />
            )}
        </div>
    );
};

export default JurisdictionCard;
