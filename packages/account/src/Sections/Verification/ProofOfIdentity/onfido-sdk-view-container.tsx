import React, { useCallback } from 'react';
import countries from 'i18n-iso-countries';
import * as Cookies from 'js-cookie';
import { init, SdkHandle, SdkResponse, SupportedLanguages } from 'onfido-sdk-ui';
import { CSSTransition } from 'react-transition-group';
import { GetSettings, ResidenceList } from '@deriv/api-types';
import { Loading, ThemedScrollbars } from '@deriv/components';
import { cryptoMathRandom, isMobile, WS } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import ErrorMessage from 'Components/error-component';
import getOnfidoPhrases from 'Constants/onfido-phrases';
import MissingPersonalDetails from 'Components/poi/missing-personal-details';
import PoiConfirmWithExampleFormContainer from 'Components/poi/poi-confirm-with-example-form-container';
import OnfidoSdkView from 'Sections/Verification/ProofOfIdentity/onfido-sdk-view';

type TAPIError = {
    code?: string;
    message?: string;
    type?: string;
};

type TServiceToken = {
    error?: TAPIError;
    service_token?: { onfido?: { token: string } };
};

type TOnfidoSdkViewContainer = {
    account_settings: GetSettings;
    country_code: string;
    documents_supported:
        | string[]
        | DeepRequired<ResidenceList>[0]['identity']['services']['onfido']['documents_supported'];
    getChangeableFields: () => string[];
    handleViewComplete: () => void;
    height?: number | string;
};

const OnfidoSdkViewContainer = ({
    account_settings,
    country_code,
    documents_supported,
    getChangeableFields,
    handleViewComplete,
    height,
}: TOnfidoSdkViewContainer) => {
    const [api_error, setAPIError] = React.useState<TAPIError>();
    const [missing_personal_details, setMissingPersonalDetails] = React.useState('');
    const [is_status_loading, setStatusLoading] = React.useState(true);
    const [retry_count, setRetryCount] = React.useState(0);
    const [is_onfido_disabled, setIsOnfidoDisabled] = React.useState(true);
    const token_timeout_ref = React.useRef<ReturnType<typeof setTimeout>>();
    const [is_confirmed, setIsConfirmed] = React.useState(false);
    const [is_onfido_initialized, setIsOnfidoInitialized] = React.useState(false);
    // IDV country code - Alpha ISO2. Onfido country code - Alpha ISO3
    // Ensures that any form of country code passed here is supported.
    const onfido_country_code =
        country_code.length !== 3 ? countries.alpha2ToAlpha3(country_code.toUpperCase()) : country_code;

    // Service Token country code - Alpha ISO2
    const token_country_code =
        country_code.length !== 2 ? countries.alpha3ToAlpha2(country_code.toUpperCase()) : country_code;

    // Onfido `document_supported` checks are made for an array of string.
    // Ensure that `document_supported` passed respects this no the matter source.
    const onfido_documents = Array.isArray(documents_supported)
        ? documents_supported
        : Object.keys(documents_supported).map(d => documents_supported[d].display_name);

    const onfido_init = React.useRef<SdkHandle>();

    const onComplete = React.useCallback(
        (data: Omit<SdkResponse, 'data'> & { data?: { id?: string } }) => {
            onfido_init?.current?.tearDown();
            const document_ids = Object.keys(data).map(key => data[key as keyof SdkResponse]?.id);
            WS.notificationEvent({
                notification_event: 1,
                category: 'authentication',
                event: 'poi_documents_uploaded',
                args: {
                    documents: document_ids,
                },
            }).then(() => {
                handleViewComplete();
            });
        },
        [handleViewComplete]
    );

    const initOnfido = React.useCallback(
        async (service_token: string) => {
            if (!service_token) return;
            try {
                onfido_init.current = await init({
                    containerId: 'onfido',
                    language: {
                        locale: (getLanguage().toLowerCase() as SupportedLanguages) || 'en',
                        phrases: getOnfidoPhrases(),
                        mobilePhrases: getOnfidoPhrases(),
                    },
                    token: service_token,
                    useModal: false,
                    useMemoryHistory: true,
                    onComplete,
                    steps: [
                        {
                            type: 'document',
                            options: {
                                documentTypes: {
                                    passport: onfido_documents.some(doc => /Passport/g.test(doc)),
                                    driving_licence: onfido_documents.some(doc => /Driving Licence/g.test(doc))
                                        ? {
                                              country: onfido_country_code,
                                          }
                                        : false,
                                    national_identity_card: onfido_documents.some(doc =>
                                        /National Identity Card/g.test(doc)
                                    )
                                        ? {
                                              country: onfido_country_code,
                                          }
                                        : false,
                                },
                                hideCountrySelection: true,
                            },
                        },
                        'face',
                    ],
                });
                setIsOnfidoInitialized(true);
            } catch (err) {
                setAPIError(err as TAPIError);
                setIsOnfidoDisabled(true);
                onfido_init.current = undefined;
            }
        },
        [onComplete, onfido_documents, onfido_country_code]
    );

    const getOnfidoServiceToken = React.useCallback(
        (): Promise<string | { error: TAPIError }> =>
            new Promise(resolve => {
                const onfido_cookie_name = 'onfido_token';
                const onfido_cookie = Cookies.get(onfido_cookie_name);

                if (!onfido_cookie) {
                    WS.serviceToken({
                        service_token: 1,
                        service: 'onfido',
                        country: token_country_code,
                    }).then((response: TServiceToken) => {
                        if (response.error) {
                            resolve({ error: response.error });
                            return;
                        }
                        if (response.service_token?.onfido) {
                            const { token } = response.service_token.onfido;
                            const in_90_minutes = 1 / 16;
                            Cookies.set(onfido_cookie_name, token, {
                                expires: in_90_minutes,
                                secure: true,
                                sameSite: 'strict',
                            });
                            resolve(token);
                        }
                    });
                } else {
                    resolve(onfido_cookie);
                }
            }),
        [token_country_code]
    );

    const handleError = (error: TAPIError) => {
        switch (error.code) {
            case 'MissingPersonalDetails':
                setMissingPersonalDetails('all');
                break;
            case 'InvalidPostalCode':
                setMissingPersonalDetails('postal_code');
                break;
            default:
                setAPIError(error);
                break;
        }
    };

    const onConfirm = useCallback(() => {
        setIsConfirmed(true);
        setIsOnfidoDisabled(false);
    }, []);

    React.useEffect(() => {
        const fetchServiceToken = () => {
            if (onfido_init.current) return;
            getOnfidoServiceToken().then(response_token => {
                if (typeof response_token !== 'string' && response_token?.error) {
                    handleError(response_token.error);
                    setStatusLoading(false);
                    setRetryCount(retry_count + 1);
                    onfido_init.current = undefined;
                } else if (typeof response_token === 'string') {
                    initOnfido(response_token).then(() => {
                        setStatusLoading(false);
                    });
                }
                if (token_timeout_ref.current) clearTimeout(token_timeout_ref.current);
            });
        };

        // retry state will re-run the token fetching
        if (retry_count === 0) {
            fetchServiceToken();
        } else if (retry_count !== 0 && retry_count < 3) {
            // Incorporating Exponential_backoff algo to prevent immediate throttling
            token_timeout_ref.current = setTimeout(() => {
                fetchServiceToken();
            }, Math.pow(2, retry_count) + cryptoMathRandom() * 1000);
        }
        return () => {
            clearTimeout(token_timeout_ref.current);
        };
    }, [getOnfidoServiceToken, initOnfido, retry_count]);

    let component_to_load;

    if (is_status_loading) {
        component_to_load = <Loading is_fullscreen={false} />;
    } else if (missing_personal_details) {
        component_to_load = (
            <MissingPersonalDetails
                has_invalid_postal_code={missing_personal_details === 'postal_code'}
                from='proof_of_identity'
            />
        );
    } else if (retry_count >= 3 && api_error) {
        // Error message will only display if retry count exceeds 3
        component_to_load = <ErrorMessage error_message={(api_error as TAPIError)?.message ?? api_error} />;
    }

    return (
        <ThemedScrollbars is_bypassed={isMobile()} height={height}>
            <div className={'onfido-container'}>
                {component_to_load || (
                    <CSSTransition
                        appear={is_onfido_disabled}
                        in={is_onfido_disabled}
                        timeout={{
                            exit: 350,
                        }}
                        classNames={{
                            exit: 'account-form__poi-confirm-example_wrapper--exit',
                        }}
                        unmountOnExit
                    >
                        <div className='account-form__poi-confirm-example_wrapper account-form__poi-confirm-example_container'>
                            <PoiConfirmWithExampleFormContainer
                                account_settings={account_settings}
                                getChangeableFields={getChangeableFields}
                                onFormConfirm={onConfirm}
                            />
                        </div>
                    </CSSTransition>
                )}
                <OnfidoSdkView
                    is_onfido_disabled={is_onfido_disabled}
                    is_confirmed={is_confirmed}
                    is_onfido_container_hidden={!!component_to_load}
                    is_onfido_initialized={is_onfido_initialized}
                />
            </div>
        </ThemedScrollbars>
    );
};

export default OnfidoSdkViewContainer;
