import { getSupportedContracts, isHighLow } from '@deriv/shared';
import { TPortfolioPosition } from '@deriv/stores/types';
import { TClosedPosition } from 'AppV2/Containers/Positions/positions-content';

type TFormatDate = ({
    time,
    locale,
    dateFormattingConfig,
}: {
    time: string | number | Date;
    locale?: string;
    dateFormattingConfig?: Record<string, string>;
}) => string;

export const DEFAULT_DATE_FORMATTING_CONFIG = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
} as Record<string, string>;

export const filterPositions = (positions: (TPortfolioPosition | TClosedPosition)[], filter: string[]) => {
    // Split contract type names with '/' (e.g. Rise/Fall)
    const splittedFilter = filter.map(option => (option.includes('/') ? option.split('/') : option)).flat();

    return positions.filter(({ contract_info }) => {
        const config = getSupportedContracts(isHighLow({ shortcode: contract_info.shortcode }))[
            contract_info.contract_type as keyof ReturnType<typeof getSupportedContracts>
        ];

        return splittedFilter.includes('main_title' in config ? config.main_title : config.name);
    });
};

export const formatDate: TFormatDate = ({
    time,
    locale = 'en-GB',
    dateFormattingConfig = DEFAULT_DATE_FORMATTING_CONFIG,
}) => new Date(time).toLocaleDateString(locale, dateFormattingConfig);
