import config_data from '../../strategies/default.json';

export const getStrategyValues = (essential_settings: { token: string | number; currency: string }, values: any) => {
    const { settings } = config_data;
    const new_settings = {
        symbol: values['bot-builder__symbol'],
        market: values['bot-builder__market'],
        submarket: values['bot-builder__submarket'],
        trade_type_category: values['bot-builder__trade_type_category'],
        trade_type: values['bot-builder__trade_type'],
    };
    const updated_settings = { ...settings, ...new_settings, ...essential_settings };
    return { ...config_data, settings: updated_settings };
};
