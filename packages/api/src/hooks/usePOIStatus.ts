import useGetAccountStatus from './useGetAccountStatus';

const usePOIStatus = () => {
    const { data: get_account_status_data, ...rest } = useGetAccountStatus();

    const poi_status = get_account_status_data?.authentication?.identity?.status;

    return {
        has_submitted_poi: poi_status === 'none',
        ...rest,
    };
};

export default usePOIStatus;
