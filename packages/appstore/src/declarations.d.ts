declare module '*.svg' {
    const content: React.SVGAttributes<SVGElement>;
    export default content;
}

declare module '@deriv/components';
declare module '@deriv/shared';
declare module '@deriv/translations';
declare module '@deriv/trader';
declare module '@deriv/account';
// TODO: remove this once types in @deriv/deriv-components is fixed
declare module '@deriv/deriv-components';
