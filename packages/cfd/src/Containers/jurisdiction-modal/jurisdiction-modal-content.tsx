import React from 'react';
import { TJurisdictionModalContentProps } from '../props.types';
import JurisdictionCard from './jurisdiction-card';
import { MARKET_TYPE, JURISDICTION } from '../../Helpers/cfd-config';

const JurisdictionModalContent = ({
    account_status,
    account_type,
    is_non_idv_design = false,
    is_virtual,
    jurisdiction_selected_shortcode,
    setJurisdictionSelectedShortcode,
    synthetic_available_accounts,
    financial_available_accounts,
    real_synthetic_accounts_existing_data,
    real_financial_accounts_existing_data,
    real_swapfree_accounts_existing_data,
    swapfree_available_accounts,
}: TJurisdictionModalContentProps) => {
    const card_classname = `cfd-jurisdiction-card--${account_type}`;

    const cardsToBeShown = (type_of_card: string) => {
        switch (account_type) {
            case MARKET_TYPE.SYNTHETIC:
                return synthetic_available_accounts?.some(account => account.shortcode === type_of_card);
            case MARKET_TYPE.ALL:
                return swapfree_available_accounts?.some(account => account.shortcode === type_of_card);
            default:
                return financial_available_accounts?.some(account => account.shortcode === type_of_card);
        }
    };

    const disableCard = (type_of_card: string) => {
        if (is_virtual && type_of_card !== JURISDICTION.SVG) {
            return true;
        }
        switch (account_type) {
            case MARKET_TYPE.SYNTHETIC:
                return real_synthetic_accounts_existing_data?.some(
                    account => account.landing_company_short === type_of_card
                );
            case MARKET_TYPE.ALL:
                return real_swapfree_accounts_existing_data?.some(
                    account => account.landing_company_short === type_of_card
                );
            default:
                return real_financial_accounts_existing_data?.some(
                    account => account.landing_company_short === type_of_card
                );
        }
    };

    const jurisdiction_cards_array = [
        JURISDICTION.SVG,
        JURISDICTION.BVI,
        JURISDICTION.VANUATU,
        JURISDICTION.LABUAN,
        JURISDICTION.MALTA_INVEST,
    ];

    return (
        <div data-testid='dt-jurisdiction-modal-content' className={`${card_classname}__wrapper`}>
            {jurisdiction_cards_array.map(
                card =>
                    cardsToBeShown(card) && (
                        <JurisdictionCard
                            account_status={account_status}
                            account_type={account_type}
                            disabled={disableCard(card)}
                            is_non_idv_design={is_non_idv_design}
                            jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                            key={card}
                            setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                            type_of_card={card}
                        />
                    )
            )}
        </div>
    );
};

export default JurisdictionModalContent;
