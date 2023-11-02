import { useCallback, useRef, useMemo, useEffect, useState, useId } from 'react';
import useOnfidoServiceToken from './useOnfidoServiceToken';
import { ALPHA_2_TO_ALPHA_3, ONFIDO_PHRASES } from '../constants';
import useSettings from './useSettings';
import useResidenceList from './useResidenceList';
import type { SdkHandle, SdkResponse } from '../types/onfido';
import useOnfidoNotificationEvent from './useOnfidoNotificationEvent';
import { v4 as uuidv4 } from 'uuid';

/** A custom hook to initialize Onfido SDK  */
const useOnfido = () => {
    const [documentsIds, setDocumentIds] = useState<string[]>([]);
    const [isOnfidoLoaded, setIsOnfidoLoaded] = useState(false);

    const onfidoRef = useRef<SdkHandle | null>(null);
    const onfidoContainerId = useMemo(() => uuidv4(), []);

    const { data: settings } = useSettings();
    const { data: residenceList } = useResidenceList();
    const {
        data: { token },
    } = useOnfidoServiceToken();
    useOnfidoNotificationEvent(documentsIds);

    const countryCode = useMemo(() => {
        return settings?.country_code || '';
    }, [settings?.country_code]);

    const supportedDocuments = useMemo(() => {
        if (countryCode && residenceList) {
            const onfidoResidence = residenceList.find(residence => residence?.value === countryCode).identity.services
                ?.onfido;
            // if we have onfido enabled for the country
            if (onfidoResidence && onfidoResidence?.is_country_supported) {
                return Object.keys(onfidoResidence?.documents_supported || {}).map(
                    (document: string) => onfidoResidence?.documents_supported[document].display_name
                );
            }
        }
        return [];
    }, [residenceList, countryCode]);

    const onComplete = useCallback((data: Omit<SdkResponse, 'data'> & { data?: { id?: string } }) => {
        const document_ids = Object.keys(data).map(key => data[key as keyof SdkResponse]?.id || '');
        onfidoRef?.current?.safeTearDown();
        setDocumentIds(document_ids);
    }, []);

    const loadOnfidoSdkScript = () => {
        if (!isOnfidoLoaded) {
            const scriptNode = document.createElement('script');
            const linkNode = document.createElement('link');

            scriptNode.id = 'onfido_sdk';
            scriptNode.src = 'https://assets.onfido.com/web-sdk-releases/latest/onfido.min.js';
            linkNode.href = 'https://assets.onfido.com/web-sdk-releases/latest/style.css';
            linkNode.rel = 'stylesheet';

            document.body.appendChild(scriptNode);
            document.body.appendChild(linkNode);

            scriptNode.addEventListener('load', () => {
                setIsOnfidoLoaded(true);
                initOnfido();
            });
        }
    };

    const initOnfido = async () => {
        const i18NLanguage = window.localStorage.getItem('i18n_language')?.toLowerCase() || 'en';
        const onfidoCountryCode =
            countryCode.length !== 3 ? ALPHA_2_TO_ALPHA_3[countryCode.toUpperCase()] : settings?.country_code;

        onfidoRef.current = await window.Onfido.init({
            containerId: onfidoContainerId,
            language: {
                locale: i18NLanguage,
                phrases: ONFIDO_PHRASES,
                mobilePhrases: ONFIDO_PHRASES,
            },
            token,
            useModal: false,
            useMemoryHistory: true,
            onComplete,
            steps: [
                {
                    type: 'document',
                    options: {
                        documentTypes: {
                            passport: supportedDocuments.some(doc => /Passport/g.test(doc || '')),
                            driving_licence: supportedDocuments.some(doc => /Driving Licence/g.test(doc || ''))
                                ? {
                                      country: onfidoCountryCode,
                                  }
                                : false,
                            national_identity_card: supportedDocuments.some(doc =>
                                /National Identity Card/g.test(doc || '')
                            )
                                ? {
                                      country: onfidoCountryCode,
                                  }
                                : false,
                        },
                        hideCountrySelection: true,
                    },
                },
                'face',
            ],
        });
    };

    useEffect(() => {
        if (token && supportedDocuments.length && !isOnfidoLoaded && countryCode) {
            loadOnfidoSdkScript();
        }
    }, [token, supportedDocuments, countryCode]);

    return {
        data: {
            onfidoRef,
            onfidoContainerId,
        },
    };
};

export default useOnfido;
