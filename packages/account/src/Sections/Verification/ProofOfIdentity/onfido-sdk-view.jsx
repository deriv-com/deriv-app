import * as React from 'react';
import { Link } from 'react-router-dom';
import { Text, ThemedScrollbars } from '@deriv/components';
import { init } from 'onfido-sdk-ui';
import { isMobile, routes, WS } from '@deriv/shared';
import { getLanguage, Localize } from '@deriv/translations';
import getOnfidoPhrases from 'Constants/onfido-phrases';

const OnfidoSdkView = ({
    handleViewComplete,
    height,
    is_description_enabled,
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
                                passport: !!documents_supported.passport,
                                driving_licence: documents_supported.driving_licence
                                    ? {
                                          country: country_code,
                                      }
                                    : false,
                                national_identity_card: documents_supported.national_identity_card
                                    ? {
                                          country: country_code,
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
    }, [documents_supported, country_code, onComplete, onfido_service_token, setAPIError]);

    React.useEffect(() => {
        initOnfido();
    }, [initOnfido]);

    return (
        <ThemedScrollbars is_bypassed={isMobile()} height={height}>
            <div className='onfido-container'>
                {is_description_enabled && (
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
