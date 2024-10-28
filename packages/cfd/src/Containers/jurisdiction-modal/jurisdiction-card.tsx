import classNames from 'classnames';
import React from 'react';
import { Jurisdiction } from '@deriv/shared';
import { getJurisdictionContents } from '../../Constants/jurisdiction-contents/jurisdiction-contents';
import { TJurisdictionCardProps } from '../props.types';
import JurisdictionCardBack from './jurisdiction-card-back';
import JurisdictionCardFront from './jurisdiction-card-front';
import { useDynamicLeverage } from '../dynamic-leverage/dynamic-leverage-context';

const JurisdictionCard = ({
    account_status,
    account_type,
    disabled,
    is_non_idv_design = false,
    jurisdiction_selected_shortcode,
    setJurisdictionSelectedShortcode,
    type_of_card,
}: TJurisdictionCardProps) => {
    const card_classname = `cfd-jurisdiction-card--${account_type}`;
    const is_synthetic = account_type === 'synthetic';
    const is_swapfree = account_type === 'all';
    const { toggleDynamicLeverage } = useDynamicLeverage();
    const card_values = getJurisdictionContents({ toggleDynamicLeverage })[type_of_card];
    const non_synthetic_card_data = is_swapfree
        ? card_values?.swapfree_contents ?? []
        : card_values?.financial_contents;
    const card_data = is_synthetic ? card_values?.synthetic_contents : non_synthetic_card_data;
    const [is_card_flipped, setIsCardFlipped] = React.useState(false);
    const is_card_selected = jurisdiction_selected_shortcode === type_of_card;
    let verification_docs = is_synthetic
        ? card_values?.synthetic_verification_docs
        : card_values?.financial_verification_docs;
    if ([Jurisdiction.BVI, Jurisdiction.VANUATU, Jurisdiction.LABUAN].includes(type_of_card) && is_non_idv_design) {
        verification_docs = ['selfie', 'identity_document', 'name_and_address'];
    }

    const cardSelection = (cardType: string) => {
        setJurisdictionSelectedShortcode(jurisdiction_selected_shortcode === cardType ? '' : cardType);
    };

    const toggleCardFlip: React.MouseEventHandler<HTMLSpanElement> = event => {
        event.stopPropagation();
        setIsCardFlipped(!is_card_flipped);
    };

    return (
        <div className='cfd-card-perspective'>
            <div
                data-testid='dt_jurisdiction_card'
                className={classNames('cfd-card-container', `${account_type}`, {
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
                    disabled={disabled}
                    is_card_selected={is_card_selected}
                    toggleCardFlip={toggleCardFlip}
                    verification_docs={verification_docs}
                />
            </div>
        </div>
    );
};

export default JurisdictionCard;
