import { useStore } from '@deriv/stores';
import useCurrencyConfig from './useCurrencyConfig';

/** A custom hook to get the currency config information for the user's current currency. */
const useCurrentCurrencyConfig = () => {
    const { client } = useStore();
    const { currency } = client;
    const { getConfig } = useCurrencyConfig();
    const currency_config = getConfig(currency);

    // Safe to do null assertion here because the user's currency is always
    // available in the currency config object so it can't be null.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return currency_config!;
};

export default useCurrentCurrencyConfig;
