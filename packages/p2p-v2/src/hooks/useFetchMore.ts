import { useCallback, useEffect } from 'react';

type TProps = {
    isFetching: boolean;
    loadMore: () => void;
    ref: React.RefObject<HTMLDivElement>;
};

/** A custom hook to load more items in the table on scroll to bottom of the table */
const useFetchMore = ({ isFetching, loadMore, ref }: TProps) => {
    //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement?: HTMLDivElement | null) => {
            if (containerRefElement) {
                const { clientHeight, scrollHeight, scrollTop } = containerRefElement;
                //once the user has scrolled within 200px of the bottom of the table, fetch more data if we can
                if (scrollHeight - scrollTop - clientHeight < 200 && !isFetching) {
                    loadMore();
                }
            }
        },
        [loadMore, isFetching]
    );

    //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
    useEffect(() => {
        fetchMoreOnBottomReached(ref.current);
    }, [fetchMoreOnBottomReached]);

    return {
        fetchMoreOnBottomReached,
    };
};

export default useFetchMore;
