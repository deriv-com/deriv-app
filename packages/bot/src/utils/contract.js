// TODO: use-shared-functions - These functions are duplicates of trader ones, export and use these instead.
export const isEnded = (contract) => (contract.status !== 'open' || !!contract.is_expired || !!contract.is_settleable);
export const getFinalPrice = (contract) => +(contract.sell_price || contract.bid_price);
export const getIndicativePrice = (contract) => getFinalPrice(contract) || null;

