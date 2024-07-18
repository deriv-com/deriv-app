import { useModulesStore } from 'Stores/useModulesStores';

const useTimeFilter = () => {
    const { positions } = useModulesStore();
    const { timeFilter, setTimeFilter, customTimeRangeFilter, setCustomTimeRangeFilter } = positions;

    return { timeFilter, setTimeFilter, customTimeRangeFilter, setCustomTimeRangeFilter };
};

export default useTimeFilter;
