import { useStore } from '@deriv/stores';

/** A custom hook used for enabling residenceSelfDeclaration checkbox in terms of use section in real account signup */
const useResidenceSelfDeclaration = () => {
    const { client } = useStore();
    const { residence, residence_list } = client;
    const is_residence_self_declaration_required = !!residence_list?.find(
        residence_item => residence_item?.value === residence
    )?.account_opening_self_declaration_required;

    return { is_residence_self_declaration_required };
};

export default useResidenceSelfDeclaration;
