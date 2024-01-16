export const symbolChange = (
    onSymbolChange: (e: {
        target: {
            name: string;
            value: unknown;
        };
    }) => Promise<void>
) =>
    onSymbolChange &&
    ((symbol: unknown) => {
        onSymbolChange({
            target: {
                name: 'symbol',
                value: symbol,
            },
        });
    });
