import { ReadMore } from '@deriv/components';
import React, { ReactElement } from 'react';
import { localize } from '@deriv/translations';

type TWithdrawStoreReadMoreWrapperProps = {
    error_content: string | ReactElement;
    openDialog: () => void;
};
const WithdrawStoreReadMoreWrapper = ({ error_content, openDialog }: TWithdrawStoreReadMoreWrapperProps) => {
    return (
        <ReadMore
            expand_text={localize('more')}
            text={error_content}
            collapse_length={28}
            openDialog={openDialog}
            show_dialog
        />
    );
};

export default WithdrawStoreReadMoreWrapper;
