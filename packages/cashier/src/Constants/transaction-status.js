export const getStatus = status => {
    let renamed_status = '';
    switch (status) {
        case 'CANCELLED':
        case 'ERROR':
        case 'REJECTED':
            renamed_status = 'Unsuccessful';
            break;
        case 'CONFIRMED':
        case 'SENT':
            renamed_status = 'Successful';
            break;
        case 'LOCKED':
            renamed_status = 'In review';
            break;
        case 'PENDING':
        case 'PERFORMING_BLOCKCHAIN_TXN':
        case 'PROCESSING':
        case 'VERIFIED':
            renamed_status = 'In process';
            break;
        default:
            renamed_status = 'In review';
            break;
    }
    return renamed_status;
};
