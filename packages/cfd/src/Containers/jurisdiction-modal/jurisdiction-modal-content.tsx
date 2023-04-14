import React from 'react';
import { TJurisdictionModalContentProps } from '../props.types';
import JurisdictionCard from './jurisdiction-card';
import { Jurisdiction } from '@deriv/shared';

const JurisdictionModalContent = ({
    account_type,
    is_virtual,
    jurisdiction_selected_shortcode,
    setJurisdictionSelectedShortcode,
    synthetic_available_accounts,
    financial_available_accounts,
    real_synthetic_accounts_existing_data,
    real_financial_accounts_existing_data,
    card_flip_status,
    flipCard,
}: TJurisdictionModalContentProps) => {
    const card_classname = `cfd-jurisdiction-card--${account_type}`;

    const cardsToBeShown = (type_of_card: string) =>
        account_type === 'synthetic'
            ? synthetic_available_accounts?.some(account => account.shortcode === type_of_card)
            : financial_available_accounts?.some(account => account.shortcode === type_of_card);

    const disableCard = (type_of_card: string) => {
        if (is_virtual && type_of_card !== 'svg') {
            return true;
        }
        return account_type === 'synthetic'
            ? real_synthetic_accounts_existing_data?.some(account => account.landing_company_short === type_of_card)
            : real_financial_accounts_existing_data?.some(account => account.landing_company_short === type_of_card);
    };
    const jurisdiction_cards_array = [
        Jurisdiction.SVG,
        Jurisdiction.BVI,
        Jurisdiction.VANUATU,
        Jurisdiction.LABUAN,
        Jurisdiction.MALTA_INVEST,
    ];
    return (
        <React.Fragment>
            <div className={`${card_classname}__wrapper`}>
                {jurisdiction_cards_array.map(
                    card =>
                        cardsToBeShown(card) && (
                            <JurisdictionCard
                                key={card}
                                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                                setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                                account_type={account_type}
                                type_of_card={card}
                                disabled={disableCard(card)}
                                card_flip_status={card_flip_status}
                                flipCard={flipCard}
                            />
                        )
                )}
            </div>
        </React.Fragment>
    );
};

export default JurisdictionModalContent;
