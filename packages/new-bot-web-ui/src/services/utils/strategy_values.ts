import config_data from '../../strategies/default.json';

export const getStrategyValues = (essential_settings: { token: string | number; currency: string }, values: any) => {
    const { settings } = config_data;
    const new_settings = {
        symbol: values['bot-builder__symbol'],
    };
    const updated_settings = { ...settings, ...new_settings, ...essential_settings };
    return { ...config_data, settings: updated_settings };
};
