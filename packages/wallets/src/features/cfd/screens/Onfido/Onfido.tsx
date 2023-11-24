import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useOnfido } from '@deriv/api';
import { useFlow } from '../../../../components/FlowProvider';
import { WalletsActionScreen } from '../../../../components/WalletsActionScreen';
import POISubmittedIcon from '../../../../public/images/accounts/ic-poi-submitted.svg';
import './Onfido.scss';

const Onfido = () => {
    const {
        data: { hasSubmitted, onfidoContainerId, onfidoRef },
    } = useOnfido();
    const { formValues, setFormValues } = useFlow();
    // if the user goes back and already submitted Onfido, check the form store first
    const hasAlreadySubmitted = formValues?.hasSubmittedOnfido || hasSubmitted;

    useEffect(() => {
        if (hasSubmitted) {
            setFormValues('hasSubmittedOnfido', hasSubmitted);
            onfidoRef?.current?.safeTearDown();
        }
    }, [hasSubmitted, setFormValues, onfidoRef]);

    return (
        <div
            className={classNames('wallets-onfido', {
                'wallets-onfido--success': hasAlreadySubmitted,
            })}
        >
            {!hasAlreadySubmitted && <div id={onfidoContainerId} />}
            {hasAlreadySubmitted && (
                <WalletsActionScreen
                    description='We’ll review your documents and notify you of its status within 5 minutes.'
                    icon={<POISubmittedIcon />}
                    title='Your proof of identity was submitted successfully'
                />
            )}
        </div>
    );
};

export default Onfido;
