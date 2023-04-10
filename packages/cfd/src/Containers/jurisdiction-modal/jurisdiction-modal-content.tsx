import React from 'react';
import { TJurisdictionModalContentProps } from '../props.types';
import JurisdictionCard from './jurisdiction-card';

const JurisdictionModalContent = ({
    account_type,
    is_virtual,
    jurisdiction_selected_shortcode,
    setJurisdictionSelectedShortcode,
    synthetic_available_accounts,
    financial_available_accounts,
    swapfree_available_accounts,
    context,
    real_synthetic_accounts_existing_data,
    real_financial_accounts_existing_data,
    real_swapfree_accounts_existing_data,
}: TJurisdictionModalContentProps) => {
    const card_classname = `cfd-jurisdiction-card--${account_type}`;

    const cardsToBeShown = (type_of_card: string) => {
        switch (account_type) {
            case 'synthetic':
                return synthetic_available_accounts?.some(account => account.shortcode === type_of_card);
            case 'all':
                return swapfree_available_accounts?.some(account => account.shortcode === type_of_card);
            default:
                return financial_available_accounts?.some(account => account.shortcode === type_of_card);
        }
    };
    const disableCard = (type_of_card: string) => {
        if (is_virtual && type_of_card !== 'svg') {
            return true;
        }
        switch (account_type) {
            case 'synthetic':
                return real_synthetic_accounts_existing_data?.some(
                    account => account.landing_company_short === type_of_card
                );
            case 'all':
                return real_swapfree_accounts_existing_data?.some(
                    account => account.landing_company_short === type_of_card
                );
            default:
                return real_financial_accounts_existing_data?.some(
                    account => account.landing_company_short === type_of_card
                );
        }
    };
    const jurisdiction_cards_array = ['svg', 'bvi', 'vanuatu', 'labuan', 'maltainvest'];
    return (
        <React.Fragment>
            <div className={`${card_classname}__wrapper`}>
                {jurisdiction_cards_array.map(
                    card =>
                        cardsToBeShown(card) && (
                            <JurisdictionCard
                                key={`${account_type}_${card}`}
                                type_of_card={card}
                                context={context}
                                disabled={disableCard(card)}
                                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                                synthetic_available_accounts={synthetic_available_accounts}
                                financial_available_accounts={financial_available_accounts}
                                swapfree_available_accounts={swapfree_available_accounts}
                                account_type={account_type}
                                setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                            />
                        )
                )}
            </div>
        </React.Fragment>
    );
};

export default JurisdictionModalContent;
