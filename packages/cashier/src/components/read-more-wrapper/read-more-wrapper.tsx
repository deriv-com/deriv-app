import { ReadMore } from '@deriv/components';
import React from 'react';
import { localize } from '@deriv/translations';
import { TReactElement } from '../../types';

type TReadMoreWrapperProps = {
    error_content: string | TReactElement;
    openDialog: VoidFunction;
};

const ReadMoreWrapper = ({ error_content, openDialog }: TReadMoreWrapperProps) => {
    return (
        <ReadMore
            expand_text={localize('more')}
            text={error_content as string}
            collapse_length={28}
            openDialog={openDialog}
            show_dialog
        />
    );
};

export default ReadMoreWrapper;
