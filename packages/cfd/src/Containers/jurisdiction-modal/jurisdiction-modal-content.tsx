import React from 'react';
import { Jurisdiction } from '@deriv/shared';
import { TJurisdictionModalContentProps } from '../props.types';
import JurisdictionCard from './jurisdiction-card';

const JurisdictionModalContent = ({
    account_status,
    account_type,
    is_virtual,
    jurisdiction_selected_shortcode,
    setJurisdictionSelectedShortcode,
    synthetic_available_accounts,
    financial_available_accounts,
    real_synthetic_accounts_existing_data,
    real_financial_accounts_existing_data,
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
        <div data-testid='dt-jurisdiction-modal-content' className={`${card_classname}__wrapper`}>
            {jurisdiction_cards_array.map(
                card =>
                    cardsToBeShown(card) && (
                        <JurisdictionCard
                            account_status={account_status}
                            account_type={account_type}
                            disabled={disableCard(card)}
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
