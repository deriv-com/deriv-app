/**
 * `getAccountTitle` is a helper function which accepts name of the account and is_virtual (isDemo) flag and return a combined string by appending the title 'Demo' if the flag is on.
 * @param accountName the name of the account such as: marketTypeDetails.title or platform.ctrader.title etc.
 * @param isDemo the flag to check if the account is a demo account.
 * @returns a string, the combined string of account name and 'Demo' if the flag is on.
 */
export const getAccountTitle = (accountName: string, isDemo = false) => {
    let name = accountName;
    if (isDemo) name += ' Demo';
    return name;
};
