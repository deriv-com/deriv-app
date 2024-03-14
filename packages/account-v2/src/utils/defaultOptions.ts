/**
 * Returns an object that allows user to skip IDV
 */

export const getIDVNotApplicableOption = (isIDVSkip?: boolean) => ({
    text: isIDVSkip ? 'I want to do this later' : "I don't have any of these",
    value: 'none',
});
