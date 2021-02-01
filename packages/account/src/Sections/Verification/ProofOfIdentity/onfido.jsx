import PropTypes from 'prop-types';
import React from 'react';
import { ThemedScrollbars, usePrevious } from '@deriv/components';
import { init } from 'onfido-sdk-ui';
import { isMobile } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import UploadComplete from 'Components/poi-upload-complete';
import Unsupported from 'Components/poi-unsupported';
import Expired from 'Components/poi-expired';
import OnfidoFailed from 'Components/poi-onfido-failed';
import Verified from 'Components/poi-verified';
import getOnfidoPhrases from 'Constants/onfido-phrases';
import { onfido_status_codes } from './proof-of-identity';

const onfido_container_id = 'onfido';

const OnfidoContainer = ({ height }) => {
    return (
        <ThemedScrollbars is_bypassed={isMobile()} height={height}>
            <div className='onfido-container'>
                <div id={onfido_container_id} />
            </div>
        </ThemedScrollbars>
    );
};

const Onfido = ({
    documents_supported,
    country_code,
    handleComplete,
    height,
    onfido_service_token,
    status,
    ...props
}) => {
    const [onfido_init, setOnfido] = React.useState(null);
    const [onfido_init_error, setOnfidoInitError] = React.useState(false);

    // didMount hook
    // added eslint-disable-line below as the init func needs to be wrapped in a useCallback but its an external sdk
    React.useEffect(() => {
        if (status === onfido_status_codes.onfido && onfido_service_token) {
            initOnfido();
        }
        return () => {
            onfido_init?.tearDown();
        };
    }, [onfido_service_token]); // eslint-disable-line react-hooks/exhaustive-deps

    const previous_onfido_service_token = usePrevious(onfido_service_token);

    const onComplete = React.useCallback(() => {
        onfido_init?.tearDown();
        handleComplete();
    }, [handleComplete, onfido_init]);

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
            setOnfido(onfido);
        } catch (err) {
            setOnfidoInitError(true);
        }
    }, [documents_supported, onComplete, onfido_service_token]);

    // didUpdate hook
    React.useEffect(() => {
        if (previous_onfido_service_token && onfido_service_token) {
            if (previous_onfido_service_token !== onfido_service_token) {
                if (status === onfido_status_codes.onfido && onfido_service_token) {
                    initOnfido();
                }
            }
        }
    }, [initOnfido, previous_onfido_service_token, onfido_service_token, status]);

    if (status === onfido_status_codes.unsupported) return <Unsupported {...props} />;

    if (onfido_init_error || onfido_service_token?.error) return <OnfidoFailed {...props} />;

    if (status === onfido_status_codes.onfido) return <OnfidoContainer height={height} />;

    switch (status) {
        case onfido_status_codes.pending:
            return <UploadComplete {...props} />;
        case onfido_status_codes.rejected:
            return <OnfidoFailed {...props} />;
        case onfido_status_codes.verified:
            return <Verified {...props} />;
        case onfido_status_codes.expired:
            return <Expired {...props} />;
        case onfido_status_codes.suspected:
            return <OnfidoFailed {...props} />;
        default:
            return null;
    }
};

Onfido.propTypes = {
    documents_supported: PropTypes.array,
    handleComplete: PropTypes.func,
    has_poa: PropTypes.bool,
    onfido_service_token: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    status: PropTypes.oneOf(Object.keys(onfido_status_codes)),
};

export default Onfido;
