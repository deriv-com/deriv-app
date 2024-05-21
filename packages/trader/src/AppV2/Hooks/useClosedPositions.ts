import { WS } from '@deriv/shared';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ProfitTable, ProfitTableResponse } from '@deriv/api-types';

type TPros = {
    contractTypes: string[];
};

const useClosedPositions = ({ contractTypes }: TPros) => {
    const [positions, setPositions] = useState<NonNullable<ProfitTable['transactions']>>([]);
    const [isLoading, setLoading] = React.useState(false);
    const positionsRef = useRef<NonNullable<ProfitTable['transactions']>>([]);

    const fetch = useCallback(async () => {
        setLoading(true);
        const data: ProfitTableResponse = await WS.profitTable(50, positionsRef.current.length, {
            contract_type: contractTypes.length > 0 ? contractTypes : undefined,
        });

        setLoading(false);
        // TODO: handle errors
        setPositions(prevPositions => [...prevPositions, ...(data?.profit_table?.transactions ?? [])]);
    }, [contractTypes]);

    useEffect(() => {
        setPositions([]);
        positionsRef.current = [];
        fetch();
    }, [fetch, contractTypes]);

    return { closedPositions: positions, isLoading, fetchMore: fetch };
};

export default useClosedPositions;
