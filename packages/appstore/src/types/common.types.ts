export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
    ? ElementType
    : never;

export type RequiredAndNotNull<T> = {
    [P in keyof T]-?: Exclude<T[P], null | undefined>;
};

export type TAccountCategory = 'real' | 'demo';
export type TPlatform = 'dxtrade' | 'mt5';
export type TMarketType = 'financial' | 'synthetic';
export type TVisibilityChecker = (platform: TPlatform) => boolean;
export type TCFDAccounts = {
    isDerivedVisible: TVisibilityChecker;
    isFinancialVisible: TVisibilityChecker;
    isDerivXVisible: TVisibilityChecker;
    hasAccount: (platform: TPlatform, shortcode: TMarketType) => boolean;
};
