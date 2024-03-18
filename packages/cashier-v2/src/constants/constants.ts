import { TMT5LandingCompanyName, TMT5MarketType } from '../hooks/types';

type TDefinedMT5LandingCompanyName = Exclude<TMT5LandingCompanyName, 'seychelles' | undefined>;

type TDefinedMT5LandingCompanyDetails = {
    name: TDefinedMT5LandingCompanyName;
    title: string;
};

type TDefinedMT5MarketType = NonNullable<TMT5MarketType>;

type TDefinedMT5MarketTypeDetails = {
    name: TDefinedMT5MarketType;
    title: string;
};

export const LandingCompanyDetails: Record<TDefinedMT5LandingCompanyName, TDefinedMT5LandingCompanyDetails> = {
    bvi: {
        name: 'bvi',
        title: 'BVI',
    },
    labuan: {
        name: 'labuan',
        title: 'Labuan',
    },
    maltainvest: {
        name: 'maltainvest',
        title: 'CFDs',
    },
    svg: {
        name: 'svg',
        title: 'SVG',
    },
    vanuatu: {
        name: 'vanuatu',
        title: 'Vanuatu',
    },
} as const;

export const MT5MarketTypeDetails: Record<TDefinedMT5MarketType, TDefinedMT5MarketTypeDetails> = {
    all: {
        name: 'all',
        title: 'Swap-Free',
    },
    financial: {
        name: 'financial',
        title: 'Financial',
    },
    synthetic: {
        name: 'synthetic',
        title: 'Derived',
    },
} as const;
