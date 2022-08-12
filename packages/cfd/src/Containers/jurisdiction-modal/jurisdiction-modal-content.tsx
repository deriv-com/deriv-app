import React from 'react';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';
import { TExistingData } from 'Components/props.types';
import { TAvailableAccountAPI } from '../props.types';
import JurisdictionCheckBox from './jurisdiction-modal-content-items/jurisdiction-modal-checkbox';
import JurisdictionCard from './jurisdiction-modal-content-items/jurisdiction-modal-card/jurisdiction-card';
import ModalFootNote from './jurisdiction-modal-content-items/jurisdiction-modal-footer';

type TJurisdictionModalContent = {
    account_type: string;
    jurisdiction_selected_shortcode: string;
    setJurisdictionSelectedShortcode: (card_type: string) => void;
    synthetic_available_accounts: TAvailableAccountAPI;
    financial_available_accounts: TAvailableAccountAPI;
    checked: boolean;
    setChecked: React.Dispatch<React.SetStateAction<boolean>>;
    real_synthetic_accounts_existing_data: TExistingData;
    real_financial_accounts_existing_data: TExistingData;
    is_virtual: boolean;
};

const JurisdictionModalContent = ({
    account_type,
    jurisdiction_selected_shortcode,
    setJurisdictionSelectedShortcode,
    synthetic_available_accounts,
    financial_available_accounts,
    checked,
    setChecked,
    real_synthetic_accounts_existing_data,
    real_financial_accounts_existing_data,
    is_virtual,
}: TJurisdictionModalContent) => {
    const card_classname = `cfd-jurisdiction-card--${account_type}`;

    const cardsToBeShown = (type_of_card: string) => {
        const is_available =
            account_type === 'synthetic'
                ? synthetic_available_accounts?.some(account => account.shortcode === type_of_card)
                : financial_available_accounts?.some(account => account.shortcode === type_of_card);
        return is_available;
    };

    const disableCard = (type_of_card: string) => {
        if (is_virtual && type_of_card !== 'svg') {
            return true;
        }
        const is_available =
            account_type === 'synthetic'
                ? real_synthetic_accounts_existing_data?.some(account => account.landing_company_short === type_of_card)
                : real_financial_accounts_existing_data?.some(
                      account => account.landing_company_short === type_of_card
                  );

        return is_available;
    };

    const jurisdiction_cards_array = ['bvi', 'maltainvest', 'vanuatu', 'labuan', 'svg'];
    return (
        <>
            <div className={`${card_classname}__wrapper`}>
                {jurisdiction_cards_array.map(
                    card =>
                        cardsToBeShown(card) && (
                            <JurisdictionCard
                                key={`${account_type}_${card}`}
                                type_of_card={card}
                                disabled={disableCard(card)}
                                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                                synthetic_available_accounts={synthetic_available_accounts}
                                financial_available_accounts={financial_available_accounts}
                                account_type={account_type}
                                setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                            />
                        )
                )}
            </div>
            <ModalFootNote card_classname={card_classname} account_type={account_type} />
            <JurisdictionCheckBox
                is_checked={checked}
                onCheck={() => setChecked(!checked)}
                class_name={`${card_classname}__jurisdiction-checkbox`}
            />
        </>
    );
};

export default connect(({ modules: { cfd }, client }: RootStore) => ({
    account_status: client.account_status,
    real_financial_accounts_existing_data: cfd.real_financial_accounts_existing_data,
    real_synthetic_accounts_existing_data: cfd.real_synthetic_accounts_existing_data,
    is_virtual: client.is_virtual,
}))(JurisdictionModalContent);
