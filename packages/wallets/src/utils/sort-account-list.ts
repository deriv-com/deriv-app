export type TAccount = {
    login?: string;
};

export function sortAccountList<T extends TAccount>(arr: T[]) {
    return arr.sort((a, b) => {
        const loginA = a?.login;
        const loginB = b?.login;

        if (loginA && loginB) {
            if (loginA < loginB) {
                return -1;
            }
            if (loginA > loginB) {
                return 1;
            }
        }
        return 0;
    });
}
