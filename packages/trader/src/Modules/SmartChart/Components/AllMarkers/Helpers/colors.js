import { DARK, LIGHT } from '../Constants/colors';

export const getColor = ({ status, profit, is_dark_theme }) => {
    const colors = is_dark_theme ? DARK : LIGHT;

    let color = colors[status || 'open'];
    if (status === 'open' && profit) {
        color = colors[profit > 0 ? 'won' : 'lost'];
    }

    return color;
};

// Accepts decimals or percentages.
export const getHexOpacity = opacity => {
    const percentages = opacity >= 0 && opacity <= 1 ? opacity * 100 : opacity;
    return ((percentages * 255) / 100).toString(16).slice(0, 2);
};
