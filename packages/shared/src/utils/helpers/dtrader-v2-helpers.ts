/* TODO: remove this component after /trader package is separated into its own repo.
It's used to keep dtrader_v2 utils that are currently shared between various packages. */

export const POSITIONS_V2_TAB_NAME = {
    OPEN: 'Open',
    CLOSED: 'Closed',
};

export const getPositionsV2TabIndexFromURL = () => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.toString()) {
        const current_opened_tab = [...searchParams.values()];
        return current_opened_tab[0] === POSITIONS_V2_TAB_NAME.OPEN.toLowerCase() ? 0 : 1;
    }
    return 0;
};

export const isDTraderV2 = () =>
    !!JSON.parse(localStorage.getItem('FeatureFlagsStore') ?? '{}')?.data?.dtrader_v2 && window.innerWidth < 600;
