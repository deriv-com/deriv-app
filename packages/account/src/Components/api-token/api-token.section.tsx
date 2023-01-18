import { Loading } from '@deriv/components';
import classNames from 'classnames';
import LoadErrorMessage from 'Components/load-error-message';
import React, { HTMLAttributes } from 'react';
import useApiTokenContext from './hooks/use-api-context';

interface IApiTokenSectionProps extends HTMLAttributes<HTMLScriptElement> {
    is_switching: boolean;
    is_app_settings: boolean;
}

const ApiTokenSection = ({ is_switching, children, is_app_settings, ...rest }: IApiTokenSectionProps) => {
    const { loading, error_message } = useApiTokenContext();

    if (loading || is_switching) {
        return <Loading is_fullscreen={false} className='account__initial-loader' data-testid={'api-token-loading'} />;
    } else if (error_message) {
        return <LoadErrorMessage error_message={error_message} />;
    }
    return (
        <section
            className={classNames('da-api-token', {
                'da-api-token--app-settings': is_app_settings,
            })}
            {...rest}
        >
            <div className='da-api-token__wrapper'>{children}</div>
        </section>
    );
};

export default ApiTokenSection;
