export const getProfitOrLoss = value => +value.replace(/,/g, '') >= 0 ? 'profit' : 'loss';
