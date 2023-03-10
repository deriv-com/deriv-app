import useAllPaymentAgentList from './useAllPaymentAgentList';

const useIsPaymentAgentVisibleInOnboarding = () => {
    const { data } = useAllPaymentAgentList();

    return !!data?.list?.length;
};

export default useIsPaymentAgentVisibleInOnboarding;
