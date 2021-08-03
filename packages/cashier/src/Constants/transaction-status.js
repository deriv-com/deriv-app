import { localize } from '@deriv/translations';

export const getStatus = status => {
    let renamed_status = '';
    switch (status) {
        case 'CANCELLED':
        case 'ERROR':
        case 'REJECTED':
            renamed_status = localize('Unsuccessful');
            break;
        case 'CONFIRMED':
        case 'SENT':
            renamed_status = localize('Successful');
            break;
        case 'LOCKED':
            renamed_status = localize('In review');
            break;
        case 'PENDING':
        case 'PERFORMING_BLOCKCHAIN_TXN':
        case 'PROCESSING':
        case 'VERIFIED':
            renamed_status = localize('In process');
            break;
        default:
            renamed_status = localize('In review');
            break;
    }
    return renamed_status;
};
