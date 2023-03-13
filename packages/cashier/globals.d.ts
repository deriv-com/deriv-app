declare module '*.svg' {
    const content: React.SVGAttributes<SVGElement>;
    export default content;
}

// Remove these two lines after convert migrating components and p2p to TS
declare module '@deriv/components';
declare module '@deriv/p2p';
