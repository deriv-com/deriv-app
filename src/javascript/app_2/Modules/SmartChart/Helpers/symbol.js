export const symbolChange = (onSymbolChange) => (
    onSymbolChange &&
    ((symbol) => {
        onSymbolChange({
            target: {
                name : 'symbol',
                value: symbol,
            },
        });
    })
);
