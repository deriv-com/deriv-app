import { useStore } from '@deriv/stores';

/** A custom hook used for enabling residenceSelfDeclaration checkbox in terms of use section in real account signup */
const useResidenceSelfDeclaration = () => {
    const { client } = useStore();
    const { residence } = client;
    //if residence is spain, we need to set is_residence_self_declaration_required  as true
    return { is_residence_self_declaration_required: residence === 'es' };
};

export default useResidenceSelfDeclaration;
