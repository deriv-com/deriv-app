import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { ThemedScrollbars, Text } from '@deriv/components';
import { init } from 'onfido-sdk-ui';
import { isMobile, routes } from '@deriv/shared';
import { getLanguage, Localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';
import UploadComplete from 'Components/poi-upload-complete';
import Expired from 'Components/poi-expired';
import Verified from 'Components/poi-verified';
import getOnfidoPhrases from 'Constants/onfido-phrases';
import RejectedReasons from 'Components/poi-rejected-reasons';
import Limited from 'Components/poi-limited';
import { onfido_status_codes } from './proof-of-identity';

const onfido_container_id = 'onfido';

const OnfidoContainer = ({ height, is_description_enabled }) => {
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

                <div id={onfido_container_id} />
            </div>
        </ThemedScrollbars>
    );
};

const Onfido = ({
    height,
    is_description_enabled,
    onfido_service_token,
    status,
    setAPIError,
    setStatus,
    refreshNotifications,
    verification_status,
    redirect_button,
}) => {
    const onfido_init = React.useRef();

    const { needs_poa, documents_supported, country_code, rejected_reasons, submissions_left } = verification_status;

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
            setStatus('pending');

            WS.authorized.getAccountStatus().then(() => {
                refreshNotifications();
            });
        });
    }, [onfido_init, refreshNotifications, setAPIError, setStatus]);

    const initOnfido = React.useCallback(async () => {
        try {
            const onfido = await init({
                containerId: onfido_container_id,
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
            onfido_init.current = onfido;
        } catch (err) {
            setAPIError(err);
        }
    }, [documents_supported, country_code, onComplete, onfido_service_token, setAPIError]);

    switch (status) {
        case onfido_status_codes.none:
            initOnfido();
            return <OnfidoContainer height={height} is_description_enabled={is_description_enabled} />;
        case onfido_status_codes.pending:
            return (
                <UploadComplete
                    needs_poa={needs_poa}
                    is_description_enabled={is_description_enabled}
                    redirect_button={redirect_button}
                />
            );
        case onfido_status_codes.rejected:
        case onfido_status_codes.suspected:
            initOnfido();
            if (!submissions_left) return <Limited />;
            return (
                <RejectedReasons rejected_reasons={rejected_reasons} setContinueUploading={() => setStatus('none')} />
            );
        case onfido_status_codes.verified:
            return (
                <Verified
                    needs_poa={needs_poa}
                    is_description_enabled={is_description_enabled}
                    redirect_button={redirect_button}
                />
            );
        case onfido_status_codes.expired:
            return <Expired />;
        default:
            return null;
    }
};

Onfido.propTypes = {
    country_code: PropTypes.string,
    documents_supported: PropTypes.array,
    handleComplete: PropTypes.func,
    has_poa: PropTypes.bool,
    height: PropTypes.number,
    is_description_enabled: PropTypes.bool,
    onfido_service_token: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    status: PropTypes.oneOf(Object.keys(onfido_status_codes)),
};

export default Onfido;
