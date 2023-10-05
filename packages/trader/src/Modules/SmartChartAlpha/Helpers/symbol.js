export const symbolChangeAlpha = onSymbolChange =>
    onSymbolChange &&
    (symbol => {
        onSymbolChange({
            target: {
                name: 'symbol',
                value: symbol,
            },
        });
    });
