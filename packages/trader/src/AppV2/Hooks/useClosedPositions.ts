import { WS } from '@deriv/shared';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ProfitTable, ProfitTableResponse } from '@deriv/api-types';

type TPros = {
    date_from?: string;
    date_to?: string;
};
// TODO: we can't filtrate by contractTypes here as for BE High/low and Rise/Fall is ONE contract. So for contractTypes filtration is implemented in position.tsx
// TODO: refactor this hook for date filtration. e.g. date_from and date_to

const useClosedPositions = ({ date_from, date_to }: TPros = {}) => {
    const [positions, setPositions] = useState<NonNullable<ProfitTable['transactions']>>([]);
    const [isLoading, setLoading] = React.useState(false);
    const positionsRef = useRef<NonNullable<ProfitTable['transactions']>>([]);

    const fetch = useCallback(async () => {
        setLoading(true);
        const data: ProfitTableResponse = await WS.profitTable(50, positionsRef.current.length, {
            date_from,
            date_to,
        });

        setLoading(false);
        // TODO: handle errors
        setPositions(prevPositions => [...prevPositions, ...(data?.profit_table?.transactions ?? [])]);
    }, [date_from, date_to]);

    useEffect(() => {
        setPositions([]);
        positionsRef.current = [];
        fetch();
    }, [fetch, date_from, date_to]);

    return { closedPositions: positions, isLoading, fetchMore: fetch };
};

export default useClosedPositions;
