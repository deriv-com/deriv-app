import classNames from 'classnames';
import React, { SyntheticEvent, useState } from 'react';
import { getJurisdictionContents } from '../../Constants/jurisdiction-contents/jurisdiction-contents';
import { TJurisdictionCardProps } from '../props.types';
import JurisdictionCardBack from './jurisdiction-card-back';
import JurisdictionCardFront from './jurisdiction-card-front';

const JurisdictionCard = ({
    account_status,
    account_type,
    disabled,
    jurisdiction_selected_shortcode,
    setJurisdictionSelectedShortcode,
    type_of_card,
}: TJurisdictionCardProps) => {
    const card_classname = `cfd-jurisdiction-card--${account_type}`;
    const is_synthetic = account_type === 'synthetic';
    const card_values = getJurisdictionContents()[type_of_card];
    const card_data = is_synthetic ? card_values.synthetic_contents : card_values.financial_contents;
    const verification_docs = is_synthetic
        ? card_values?.synthetic_verification_docs
        : card_values?.financial_verification_docs;
    const [is_card_flipped, setIsCardFlipped] = useState(false);
    const is_card_selected = jurisdiction_selected_shortcode === type_of_card;

    const cardSelection = (cardType: string) => {
        setJurisdictionSelectedShortcode(jurisdiction_selected_shortcode === cardType ? '' : cardType);
    };

    const toggleCardFlip = (event: SyntheticEvent) => {
        event.stopPropagation();
        setIsCardFlipped(!is_card_flipped);
    };

    return (
        <div className='cfd-card-perspective'>
            <div
                className={classNames('cfd-card-container', {
                    'cfd-card-flipped': is_card_flipped,
                    'cfd-card-disabled': disabled,
                })}
                onClick={disabled ? () => undefined : () => cardSelection(type_of_card)}
            >
                <JurisdictionCardFront
                    account_status={account_status}
                    card_classname={card_classname}
                    card_data={card_data}
                    card_values={card_values}
                    disabled={disabled}
                    is_card_selected={is_card_selected}
                    toggleCardFlip={toggleCardFlip}
                    type_of_card={type_of_card}
                    verification_docs={verification_docs}
                />
                <JurisdictionCardBack
                    card_classname={card_classname}
                    is_card_selected={is_card_selected}
                    toggleCardFlip={toggleCardFlip}
                    verification_docs={verification_docs}
                />
            </div>
        </div>
    );
};

export default JurisdictionCard;
