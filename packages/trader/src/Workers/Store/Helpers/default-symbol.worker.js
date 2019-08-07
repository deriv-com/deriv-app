import { pickDefaultSymbol } from 'Stores/Modules/Trading/Helpers/default-symbol';

onmessage = (event) => {
    const active_symbols = JSON.parse(event.data[0]);
    const chart_favorites = JSON.parse(event.data[1]);
    const  symbol = pickDefaultSymbol(active_symbols, chart_favorites);
    postMessage(symbol);
};
