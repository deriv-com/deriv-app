import * as React from 'react';
import * as Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { Loading, Text, ThemedScrollbars } from '@deriv/components';
import { init } from 'onfido-sdk-ui';
import { isMobile, routes, WS } from '@deriv/shared';
import { getLanguage, Localize } from '@deriv/translations';
import getCountryISO3 from 'country-iso-2-to-3';
import getOnfidoPhrases from 'Constants/onfido-phrases';
import MissingPersonalDetails from 'Components/poi-missing-personal-details';

const OnfidoSdkView = ({ handleViewComplete, height, is_from_external, selected_country, setAPIError }) => {
    const [onfido_service_token, setOnfidoToken] = React.useState();
    const [missing_personal_details, setMissingPersonalDetails] = React.useState(false);
    const [is_status_loading, setStatusLoading] = React.useState(true);

    const has_invalid_postal_code = missing_personal_details === 'postal_code';

    const {
        identity: {
            services: {
                onfido: { documents_supported },
            },
        },
        value: country_code,
    } = selected_country;

    // IDV uses ISO2 country code format while onfido uses ISO3. This will check first and convert it to the proper ISO3 country code.
    const onfido_country_code = country_code.length < 3 ? getCountryISO3(country_code.toUpperCase()) : country_code;
    const onfido_documents = Object.keys(documents_supported).map(d => documents_supported[d].display_name);

    const onfido_init = React.useRef();

    const onComplete = React.useCallback(
        data => {
            onfido_init?.tearDown();
            onfido_init?.current?.tearDown();
            const document_ids = Object.keys(data).map(key => data[key].id);

            WS.notificationEvent({
                notification_event: 1,
                category: 'authentication',
                event: 'poi_documents_uploaded',
                args: {
                    documents: document_ids,
                },
            }).then(response => {
                if (response.error) {
                    setAPIError(response.error);
                    return;
                }
                handleViewComplete();
            });
        },
        [setAPIError, handleViewComplete]
    );

    const initOnfido = React.useCallback(async () => {
        try {
            const onfido_ref = await init({
                containerId: 'onfido',
                language: {
                    locale: getLanguage().toLowerCase() || 'en',
                    phrases: getOnfidoPhrases(),
                    mobilePhrases: getOnfidoPhrases(),
                },
                token: onfido_service_token,
                useModal: false,
                onComplete,
                steps: [
                    {
                        type: 'document',
                        options: {
                            documentTypes: {
                                passport: onfido_documents.includes('Passport'),
                                driving_licence: onfido_documents.includes('Driving Licence')
                                    ? {
                                          country: onfido_country_code,
                                      }
                                    : false,
                                national_identity_card: onfido_documents.includes('National Identity Card')
                                    ? {
                                          country: onfido_country_code,
                                      }
                                    : false,
                            },
                        },
                    },
                    'face',
                ],
            });
            onfido_init.current = onfido_ref;
        } catch (err) {
            setAPIError(err);
        }
    }, [onfido_service_token, onComplete, onfido_documents, onfido_country_code, setAPIError]);

    const getOnfidoServiceToken = React.useCallback(
        async () =>
            new Promise(resolve => {
                const onfido_cookie_name = 'onfido_token';
                const onfido_cookie = Cookies.get(onfido_cookie_name);

                if (!onfido_cookie) {
                    WS.serviceToken({
                        service_token: 1,
                        service: 'onfido',
                    }).then(response => {
                        if (response.error) {
                            resolve({ error: response.error });
                            return;
                        }

                        const { token } = response.service_token.onfido;
                        const in_90_minutes = 1 / 16;
                        Cookies.set(onfido_cookie_name, token, {
                            expires: in_90_minutes,
                            secure: true,
                            sameSite: 'strict',
                        });
                        resolve(token);
                    });
                } else {
                    resolve(onfido_cookie);
                }
            }),
        []
    );

    React.useEffect(() => {
        getOnfidoServiceToken()
            .then(response_token => {
                if (response_token.error) {
                    const code = response_token?.error?.code;

                    switch (code) {
                        case 'MissingPersonalDetails':
                            setMissingPersonalDetails('all');
                            break;
                        case 'InvalidPostalCode':
                            setMissingPersonalDetails('postal_code');
                            break;
                        default:
                            setAPIError(response_token.error);
                            break;
                    }
                } else {
                    setOnfidoToken(response_token);
                }
            })
            .then(() => {
                initOnfido().then(() => {
                    setStatusLoading(false);
                });
            });
    }, [getOnfidoServiceToken, initOnfido, setAPIError]);

    let component_to_load;

    if (is_status_loading) {
        component_to_load = <Loading is_fullscreen={false} />;
    }

    if (missing_personal_details) {
        component_to_load = (
            <MissingPersonalDetails has_invalid_postal_code={has_invalid_postal_code} from='proof_of_identity' />
        );
    }

    return (
        <ThemedScrollbars is_bypassed={isMobile()} height={height}>
            <div className='onfido-container'>
                {component_to_load ||
                    (!is_from_external && (
                        <React.Fragment>
                            <div className='onfido-container__message'>
                                <Text size='xs'>
                                    <Localize
                                        i18n_default_text='Before uploading your document, please ensure that your <0>personal details</0> are updated to match your proof of identity. This will help to avoid delays during the verification process.'
                                        components={[<Link to={routes.personal_details} key={0} className='link' />]}
                                    />
                                </Text>
                            </div>
                            <div id='onfido' />
                        </React.Fragment>
                    ))}
            </div>
        </ThemedScrollbars>
    );
};

export default OnfidoSdkView;
