import { useStore } from '@deriv/stores';

const useDuplicateDOBPhone = () => {
    const { client } = useStore();
    const { is_duplicate_dob_phone } = client;

    return is_duplicate_dob_phone;
};

export default useDuplicateDOBPhone;
