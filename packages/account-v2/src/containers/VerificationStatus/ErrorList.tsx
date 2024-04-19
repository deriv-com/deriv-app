import React from 'react';
import { DerivLightDeclinedPoiIcon } from '@deriv/quill-icons';
import { IconWithMessage } from '../../components/IconWithMessage';
import { ErrorListItem } from './ErrorListItem';

export const ErrorList = ({ errorList }: { errorList: string[] }) => (
    <IconWithMessage
        icon={<DerivLightDeclinedPoiIcon height={128} />}
        title='Your proof of identity submission failed because:'
    >
        <div>
            {errorList.length < 2 ? (
                <ErrorListItem text={errorList[0]} />
            ) : (
                errorList.map((error, index) => <ErrorListItem index={index + 1} key={error} text={error} />)
            )}
        </div>
    </IconWithMessage>
);
