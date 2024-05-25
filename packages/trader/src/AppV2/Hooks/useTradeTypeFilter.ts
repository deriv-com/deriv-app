import { useModulesStore } from 'Stores/useModulesStores';

type TUseTradeTypeFilter = { isClosedTab?: boolean };

const useTradeTypeFilter = ({ isClosedTab }: TUseTradeTypeFilter) => {
    const { positions } = useModulesStore();
    const { setClosedContractTypeFilter, setOpenContractTypeFilter, openContractTypeFilter, closedContractTypeFilter } =
        positions;

    const contractTypeFilter = isClosedTab ? closedContractTypeFilter : openContractTypeFilter;
    const setContractTypeFilter = isClosedTab ? setClosedContractTypeFilter : setOpenContractTypeFilter;

    return { contractTypeFilter, setContractTypeFilter };
};

export default useTradeTypeFilter;
