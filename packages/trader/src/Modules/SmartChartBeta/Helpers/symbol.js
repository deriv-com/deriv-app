export const symbolChangeBeta = onSymbolChange =>
    onSymbolChange &&
    (symbol => {
        onSymbolChange({
            target: {
                name: 'symbol',
                value: symbol,
            },
        });
    });
