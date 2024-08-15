import React from 'react';
import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';
import { HintBox, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TOnfidoSdkView = {
    is_onfido_disabled: boolean;
    is_onfido_container_hidden?: boolean;
    onfido_element_id?: string;
    is_confirmed: boolean;
    data_testid?: string;
    is_onfido_initialized?: boolean;
};

const OnfidoSdkView = ({
    is_onfido_disabled,
    is_onfido_container_hidden,
    onfido_element_id = 'onfido',
    is_confirmed,
    data_testid,
    is_onfido_initialized,
}: TOnfidoSdkView) => {
    const [is_status_message_visible, setIsStatusMessageVisible] = React.useState(false);
    const transition_in_timeout_ref = React.useRef<ReturnType<typeof setTimeout>>();
    const transition_out_timeout_ref = React.useRef<ReturnType<typeof setTimeout>>();

    React.useEffect(() => {
        const onConfirm = () => {
            transition_in_timeout_ref.current = setTimeout(() => {
                setIsStatusMessageVisible(true);
            }, 800);
            transition_out_timeout_ref.current = setTimeout(() => {
                setIsStatusMessageVisible(false);
                // the requirement is to hide the message after 5 sec, 4650 here + 350 in CSSTransition to make it smoother
            }, 4650);
        };

        if (is_confirmed) {
            onConfirm();
        }
    }, [is_confirmed]);

    React.useEffect(() => {
        return () => {
            clearTimeout(transition_in_timeout_ref.current);
            clearTimeout(transition_out_timeout_ref.current);
        };
    }, []);

    return (
        <div className='onfido-container-view_wrapper'>
            <div className={clsx({ 'onfido-container__status-message_container': !is_onfido_disabled })}>
                <CSSTransition
                    appear={is_status_message_visible}
                    in={is_status_message_visible}
                    timeout={{
                        exit: 350,
                    }}
                    classNames={{
                        exit: 'onfido-container__status-message--exit',
                    }}
                    unmountOnExit
                >
                    <HintBox
                        className='onfido-container__status-message'
                        icon='IcAlertAnnounce'
                        message={
                            <Text as='p' size='xxxs'>
                                <Localize i18n_default_text='Your personal details have been saved successfully.' />
                            </Text>
                        }
                        is_info
                    />
                </CSSTransition>
            </div>
            <section>
                {is_onfido_disabled && is_onfido_initialized && (
                    <div className='onfido-container__info-message'>
                        <HintBox
                            icon='IcInfoBlue'
                            message={
                                <Text as='p' size='xxxs'>
                                    <Localize i18n_default_text='Hit the checkbox above to choose your document.' />
                                </Text>
                            }
                            is_info
                        />
                    </div>
                )}
                <div
                    data-testid={data_testid}
                    id={onfido_element_id}
                    className={clsx({
                        'onfido-container__disabled': is_onfido_disabled,
                        'onfido-container__hidden': is_onfido_container_hidden,
                    })}
                />
            </section>
        </div>
    );
};

export default OnfidoSdkView;
