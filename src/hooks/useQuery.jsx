import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const useQuery = () => {
    const [params] = useSearchParams();
    return useMemo(() => Object.fromEntries([...params]), [params]);
};

export default useQuery;
