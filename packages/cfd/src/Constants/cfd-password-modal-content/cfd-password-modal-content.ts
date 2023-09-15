// TODO: Update with other platform and CFDs
export const getAppIcon = type => {
    switch (type) {
        case 'synthetic':
            return 'IcAppstoreDerived';
        case 'all':
            return 'IcAppstoreSwapFree';
        case 'financial':
            return 'IcAppstoreFinancial';
        default:
            return '';
    }
};
