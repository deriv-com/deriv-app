import React, { useCallback } from 'react';
import countries from 'i18n-iso-countries';
import { init, SdkHandle, SdkResponse, SupportedLanguages } from 'onfido-sdk-ui';
import { CSSTransition } from 'react-transition-group';
import { useNotificationEvent, useServiceToken, useSettings } from '@deriv/api';
import { ResidenceList } from '@deriv/api-types';
import { Loading, ThemedScrollbars } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import ErrorMessage from 'Components/error-component';
import MissingPersonalDetails from 'Components/poi/missing-personal-details';
import PoiConfirmWithExampleFormContainer from 'Components/poi/poi-confirm-with-example-form-container';
import getOnfidoPhrases from 'Constants/onfido-phrases';
import OnfidoSdkView from 'Sections/Verification/ProofOfIdentity/onfido-sdk-view';

type TAPIError = {
    code?: string;
    message?: string;
    type?: string;
};

type TOnfidoSdkViewContainer = {
    country_code: string;
    documents_supported:
        | string[]
        | DeepRequired<ResidenceList>[0]['identity']['services']['onfido']['documents_supported'];
    getChangeableFields: () => string[];
    handleViewComplete: () => void;
    height?: number | string;
    is_default_enabled?: boolean;
};

const OnfidoSdkViewContainer = observer(
    ({
        country_code,
        documents_supported,
        getChangeableFields,
        handleViewComplete,
        height,
        is_default_enabled,
    }: TOnfidoSdkViewContainer) => {
        const [api_error, setAPIError] = React.useState<string>();
        const [missing_personal_details, setMissingPersonalDetails] = React.useState('');
        const [is_onfido_disabled, setIsOnfidoDisabled] = React.useState(true);
        const [is_confirmed, setIsConfirmed] = React.useState(false);
        const [is_onfido_initialized, setIsOnfidoInitialized] = React.useState(false);

        const { common, ui } = useStore();
        const { current_language } = common;
        const { is_mobile } = ui;

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

        const { data: account_settings } = useSettings();

        const { send, isSuccess: isNotified } = useNotificationEvent();

        const { service_token, isSuccess, isError, error, isFetched, isLoading } = useServiceToken({
            service: 'onfido',
            country: token_country_code,
        });
        let component_to_load: React.ReactNode;

        const onfido_init = React.useRef<SdkHandle>();

        const onComplete = (data: Omit<SdkResponse, 'data'> & { data?: { id?: string } }) => {
            onfido_init?.current?.tearDown();
            const document_ids = Object.keys(data).map(key => data[key as keyof SdkResponse]?.id);
            if (document_ids?.length) {
                send({
                    category: 'authentication',
                    event: 'poi_documents_uploaded',
                    args: {
                        documents: document_ids as Array<string>,
                    },
                });
            }
        };

        const initOnfido = React.useCallback(
            async (service_token: string) => {
                if (!service_token) return;
                try {
                    onfido_init.current = await init({
                        containerId: 'onfido',
                        language: {
                            locale:
                                (`${current_language?.toLowerCase()}_${current_language?.toUpperCase()}` as SupportedLanguages) ||
                                'en_US',
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
                    setAPIError(err?.message ?? err);
                    setIsOnfidoDisabled(true);
                    onfido_init.current = undefined;
                }
            },
            [onComplete, onfido_documents, onfido_country_code, current_language]
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
                    setAPIError(error.message);
                    break;
            }
        };

        const onConfirm = useCallback(() => {
            setIsConfirmed(true);
            setIsOnfidoDisabled(false);
        }, []);

        React.useEffect(() => {
            /**
             * Handled re-initialization of onfido sdk when language is changed
             */
            if (current_language) {
                if (isSuccess && service_token?.onfido?.token) {
                    initOnfido(service_token?.onfido?.token);
                } else if (isError) {
                    handleError(error as TAPIError);
                }
            }
        }, [current_language, isFetched]);

        React.useEffect(() => {
            /**
             * Enables onfido sdk
             * Pass is_default_enabled to enable onfido immediately if personal detail component is not required
             * so no user prompt will be there so submit the details in i.e. in case of flow for nigerian clients ATM
             */
            if (is_default_enabled) {
                setIsOnfidoDisabled(false);
            }
        }, [is_default_enabled]);

        React.useEffect(() => {
            /**
             * Handles cleanup operations when document submission is completed
             */
            if (isNotified) {
                handleViewComplete();
            }
        }, [isNotified]);

        if (isLoading) {
            component_to_load = <Loading is_fullscreen={false} />;
        } else if (missing_personal_details) {
            component_to_load = (
                <MissingPersonalDetails
                    has_invalid_postal_code={missing_personal_details === 'postal_code'}
                    from='proof_of_identity'
                />
            );
        } else if (api_error) {
            // Error message will only display if retry count exceeds 3
            component_to_load = <ErrorMessage message={api_error} />;
        }

        return (
            <ThemedScrollbars is_bypassed={is_mobile} height={height}>
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
    }
);

OnfidoSdkViewContainer.displayName = 'OnfidoSdkViewContainer';

export default OnfidoSdkViewContainer;
