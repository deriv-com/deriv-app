declare module '*.svg' {
    const content: React.SVGAttributes<SVGElement>;
    export default content;
}

declare module '@deriv/components';
declare module '@deriv/shared';
declare module '@deriv/translations';
declare module '@deriv/trader';
declare module '@deriv/account';
declare module '@deriv/deriv-components';
// TODO: remove the above line once types in @deriv/deriv-components is fixed
