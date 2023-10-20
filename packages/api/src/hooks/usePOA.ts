import useAuthentication from './useAuthentication';

/** A custom hook to get the proof of address verification info of the current user  */
const usePOA = () => {
    const { data: authentication_data, ...rest } = useAuthentication();

    return {
        data: authentication_data?.document,
        ...rest,
    };
};

export default usePOA;
