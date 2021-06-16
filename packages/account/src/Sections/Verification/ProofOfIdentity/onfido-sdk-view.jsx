import * as React from 'react';
import { Link } from 'react-router-dom';
import { ThemedScrollbars, Text, Button } from '@deriv/components';
import { init } from 'onfido-sdk-ui';
import { isMobile, routes } from '@deriv/shared';
import { getLanguage, Localize, localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';
import FormFooter from 'Components/form-footer';
import getOnfidoPhrases from 'Constants/onfido-phrases';
import BackButtonIcon from '../../../Assets/ic-poi-back-btn.svg';

const OnfidoSdkView = ({
    height,
    is_description_enabled,
    onfido_service_token,
    onfido,
    setAPIError,
    handleViewComplete,
    handleBack,
}) => {
    const { documents_supported, country_code } = onfido;
    const onfido_init = React.useRef();

    const onComplete = React.useCallback(() => {
        onfido_init?.current?.tearDown();

        WS.notificationEvent({
            notification_event: 1,
            category: 'authentication',
            event: 'poi_documents_uploaded',
        }).then(response => {
            if (response.error) {
                setAPIError(response.error);
                return;
            }
            handleViewComplete();
        });
    }, [setAPIError, handleViewComplete]);

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
                                passport: documents_supported.some(doc => /Passport/g.test(doc)),
                                driving_licence: documents_supported.some(doc => /Driving Licence/g.test(doc))
                                    ? {
                                          country: country_code,
                                      }
                                    : false,
                                national_identity_card: documents_supported.some(doc =>
                                    /National Identity Card/g.test(doc)
                                )
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

                <FormFooter>
                    <Button onClick={handleBack} className='back-btn' type='button' has_effect large secondary>
                        <BackButtonIcon className='back-btn' /> {localize('Go Back')}
                    </Button>
                </FormFooter>
            </div>
        </ThemedScrollbars>
    );
};

export default OnfidoSdkView;
