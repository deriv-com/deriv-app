import { ReadMore } from '@deriv/components';
import React, { ReactElement } from 'react';
import { localize } from '@deriv/translations';

type TReadMoreWrapperProps = {
    error_content: string | ReactElement;
    openDialog: () => void;
};

const ReadMoreWrapper = ({ error_content, openDialog }: TReadMoreWrapperProps) => {
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

export default ReadMoreWrapper;
