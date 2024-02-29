import { useResidenceList } from '@deriv/api';
import { useStore } from '@deriv/stores';

/** A custom hook used for enabling residenceSelfDeclaration checkbox in terms of use section in real account signup */
const useResidenceSelfDeclaration = () => {
    const { client } = useStore();
    const { data: residence_list } = useResidenceList();
    const { residence } = client;
    const is_residence_self_declaration_required = residence_list?.find(
        residence_item => residence_item?.value === residence
    )?.account_opening_signup_declaration_required;

    return { is_residence_self_declaration_required };
};

export default useResidenceSelfDeclaration;
