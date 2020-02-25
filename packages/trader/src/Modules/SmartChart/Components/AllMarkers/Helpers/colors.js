import { calculateHexOpacity } from './calculations';

export const getColor = (status, is_dark_theme, profit) => {
    const DARK = {
        open: '#377cfc',
        won: '#00a79e',
        lost: '#cc2e3d',
        sold: '#ffad3a',
        fg: '#ffffff',
        bg: '#0e0e0e',
    };

    const LIGHT = {
        open: '#377cfc',
        won: '#4bb4b3',
        lost: '#ec3f3f',
        sold: '#ffad3a',
        fg: '#333333',
        bg: '#ffffff',
    };
    const colors = is_dark_theme ? DARK : LIGHT;

    let color = colors[status || 'open'];
    if (status === 'open' && profit) {
        color = colors[profit > 0 ? 'won' : 'lost'];
    }

    return color;
};

export const getOpacity = should_highlight_contract => {
    if (should_highlight_contract) return '';
    return calculateHexOpacity(0.4);
};
