import * as React from 'react';
import { Link } from 'react-router-dom';
import { Text, ThemedScrollbars } from '@deriv/components';
import { init } from 'onfido-sdk-ui';
import { isMobile, routes, WS } from '@deriv/shared';
import { getLanguage, Localize } from '@deriv/translations';
import getCountryISO3 from 'country-iso-2-to-3';
import getOnfidoPhrases from 'Constants/onfido-phrases';

const OnfidoSdkView = ({
    handleViewComplete,
    height,
    is_from_external,
    onfido_service_token,
    selected_country,
    setAPIError,
}) => {
    const {
        identity: {
            services: {
                onfido: { documents_supported },
            },
        },
        value: country_code,
    } = selected_country;

    // IDV uses iso2 (2 alphabet) country code format while onfido uses iso3
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
    }, [documents_supported, onfido_country_code, onComplete, onfido_service_token, setAPIError]);

    React.useEffect(() => {
        initOnfido();
    }, [initOnfido]);

    return (
        <ThemedScrollbars is_bypassed={isMobile()} height={height}>
            <div className='onfido-container'>
                {!is_from_external && (
                    <div className='onfido-container__message'>
                        <Text size='xs'>
                            <Localize
                                i18n_default_text='Before uploading your document, please ensure that your <0>personal details</0> are updated to match your proof of identity. This will help to avoid delays during the verification process.'
                                components={[<Link to={routes.personal_details} key={0} className='link' />]}
                            />
                        </Text>
                    </div>
                )}
                <div id='onfido' />
            </div>
        </ThemedScrollbars>
    );
};

export default OnfidoSdkView;
