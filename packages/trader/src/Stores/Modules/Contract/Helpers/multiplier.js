export const isMultiplierContract = (contract_type) => /MULT/i.test(contract_type);

export const getCommission = ({ commission, amount, multiplier }) => {
    return (commission * amount * multiplier) / 100;
};
