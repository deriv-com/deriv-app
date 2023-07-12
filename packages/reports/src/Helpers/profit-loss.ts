export const getProfitOrLoss = (value: string) => (+value.replace(/,/g, '') >= 0 ? 'profit' : 'loss');
