import { getSupportedContracts, isHighLow } from '@deriv/shared';
import { TClosedPositions } from '../Containers/Positions/positions';

export const filterPositions = (positions: TClosedPositions, filter: string[]) => {
    // Split contract type names with '/' (e.g. Rise/Fall)
    const splittedFilter = filter.map(option => (option.includes('/') ? option.split('/') : option)).flat();

    //TODO: Create own config instead of getSupportedContracts
    return positions.filter(({ contract_type, shortcode }) => {
        const config = getSupportedContracts(isHighLow({ shortcode }))[
            contract_type as keyof ReturnType<typeof getSupportedContracts>
        ];

        return splittedFilter.includes('main_title' in config ? config.main_title : config.name);
    });
};
