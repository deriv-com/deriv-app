import { TPortfolioPosition } from '@deriv/stores/types';
import { getSupportedContracts, isHighLow } from '@deriv/shared';

export const filterPositions = (positions: TPortfolioPosition[], filter: string[]) => {
    // Split contract type names with '/' (e.g. Rise/Fall)
    const splittedFilter = filter.map(option => (option.includes('/') ? option.split('/') : option)).flat();

    //TODO: Create own config instead of getSupportedContracts
    return positions.filter(({ contract_info }) => {
        const config = getSupportedContracts(isHighLow({ shortcode: contract_info.shortcode }))[
            contract_info.contract_type as keyof ReturnType<typeof getSupportedContracts>
        ];

        return splittedFilter.includes('main_title' in config ? config.main_title : config.name);
    });
};
