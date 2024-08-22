import React from 'react';
import { useTraderStore } from 'Stores/useTraderStores';
import { useStore } from '@deriv/stores';
import { cloneObject, getContractCategoriesConfig, getContractTypesConfig, WS } from '@deriv/shared';

type TContractType = {
    text?: string;
    value: string;
};

export type TContractTypesList = {
    [key: string]: {
        name: string;
        categories: DeepRequired<TContractType[]>;
    };
};

const useContractsForCompany = () => {
    const [contract_types_list, setContractTypesList] = React.useState<TContractTypesList | []>([]);
    const { setContractTypesListV2 } = useTraderStore();
    const { client } = useStore();
    const { landing_company_shortcode } = client;
    const contract_categories = getContractCategoriesConfig();
    const available_categories = cloneObject(contract_categories);
    const contract_types = getContractTypesConfig();
    let available_contract_types: ReturnType<typeof getContractTypesConfig> = {};

    const fetchContractForCompany = React.useCallback(async () => {
        let response;

        const request = {
            landing_company: landing_company_shortcode,
        };

        try {
            response = await WS.contractsForCompany(request);
            const { contracts_for_company = [], error } = response;
            available_contract_types = {};

            if (!error && contracts_for_company?.available.length) {
                contracts_for_company.available.forEach((contract: any) => {
                    const type = Object.keys(contract_types).find(
                        key =>
                            contract_types[key].trade_types.indexOf(contract.contract_type) !== -1 &&
                            (contract.contract_type !== 'PUT' || contract_types[key].barrier_count === 1) // To distinguish betweeen Rise/Fall & Higher/Lower
                    );

                    if (!type) return; // ignore unsupported contract types

                    if (!available_contract_types[type]) {
                        // extend contract_categories to include what is needed to create the contract list
                        const sub_cats =
                            available_categories[
                                Object.keys(available_categories).find(
                                    key => available_categories[key].categories.indexOf(type) !== -1
                                ) ?? ''
                            ].categories;

                        if (!sub_cats) return;

                        sub_cats[(sub_cats as string[]).indexOf(type)] = {
                            value: type,
                            text: contract_types[type].title,
                        };

                        available_contract_types[type] = cloneObject(contract_types[type]);
                    }
                });

                setContractTypesListV2(available_categories);
                setContractTypesList(available_categories);
            }
        } catch (err) {
            /* eslint-disable no-console */
            console.error(err);
        }
    }, [setContractTypesListV2]);

    React.useEffect(() => {
        fetchContractForCompany();
    }, [fetchContractForCompany]);

    return { contract_types_list };
};

export default useContractsForCompany;
