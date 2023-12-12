import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageList from '../../../icon-message-list';

type TIconMessageList = {
    handleRequireSubmission: () => void;
    rejected_reasons: string[];
};

export const RejectedReasons = ({ handleRequireSubmission, rejected_reasons }: TIconMessageList) => (
    <IconMessageList
        message={localize('Your proof of identity submission failed because:')}
        icon={<Icon icon='IcPoiFailed' size={128} />}
        message_list={rejected_reasons}
        onContinue={handleRequireSubmission}
    />
);
