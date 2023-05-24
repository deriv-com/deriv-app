import classNames from 'classnames';
import React from 'react';
import { Button, Icon, Modal, RadioGroup, Input, MobileFullPageModal, ThemedScrollbars, Text } from '@deriv/components';
import { Formik, Form, Field } from 'formik';
import { localize } from '@deriv/translations';
import { config, save_types } from '@deriv/bot-skeleton';
import { isMobile } from '@deriv/shared';
import { useDBotStore } from 'Stores/useDBotStore';
import { useStore, observer } from '@deriv/stores';

type TSaveModalForm = {
    bot_name: string;
    button_status: string;
    is_authorised: boolean;
    onConfirmSave: () => void;
    onDriveConnect: () => void;
    validateBotName: () => void;
    toggleSaveModal: () => void;
    is_mobile: boolean;
    is_onscreen_keyboard_active: boolean;
    setCurrentFocus: () => void;
};

type TIconRadio = {
    icon: string;
    text: string;
    google_drive_connected: string;
    onDriveConnect: () => void;
};

const SaveModalForm = ({
    bot_name,
    button_status,
    is_authorised,
    onConfirmSave,
    onDriveConnect,
    validateBotName,
    toggleSaveModal,
    is_mobile,
    is_onscreen_keyboard_active,
    setCurrentFocus,
}: TSaveModalForm) => (
    <Formik
        initialValues={{
            is_local: true,
            save_as_collection: false,
            bot_name: bot_name === config.default_file_name ? '' : bot_name,
        }}
        validate={validateBotName}
        onSubmit={onConfirmSave}
    >
        {({ values: { is_local }, setFieldValue, touched, errors }) => {
            const content_height = !is_mobile ? '500px' : `calc(100%)`;
            return (
                <ThemedScrollbars height={content_height} autohide>
                    <Form className={classNames({ 'form--active-keyboard': is_onscreen_keyboard_active })}>
                        <div className='modal__content'>
                            <Text size='xs' line_height='l'>
                                {localize(
                                    'Enter your bot name, choose to save on your computer or Google Drive, and hit '
                                )}
                                <strong>{localize('Save.')}</strong>
                            </Text>
                            <div className='modal__content-row'>
                                <Field name='bot_name'>
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            className='save-type__input'
                                            type='text'
                                            placeholder={localize('Untitled Bot')}
                                            error={touched[field.name] && errors[field.name]}
                                            label={localize('Bot name')}
                                            onFocus={e => setCurrentFocus(e.currentTarget.name)}
                                            onBlur={() => setCurrentFocus(null)}
                                        />
                                    )}
                                </Field>
                            </div>
                            <div className='modal__content-row'>
                                <RadioGroup
                                    className='radio-group__save-type'
                                    name='is_local'
                                    selected={(() => {
                                        if (is_authorised) {
                                            return is_local ? save_types.LOCAL : save_types.GOOGLE_DRIVE;
                                        }

                                        return save_types.LOCAL;
                                    })()}
                                    onToggle={() => setFieldValue('is_local', !is_local)}
                                >
                                    <RadioGroup.Item
                                        id='local'
                                        label={
                                            <IconRadio
                                                text={localize(is_mobile ? 'Local' : 'My computer')}
                                                icon={<Icon icon={is_mobile ? 'IcLocal' : 'IcMyComputer'} size={48} />}
                                            />
                                        }
                                        value={save_types.LOCAL}
                                    />
                                    <RadioGroup.Item
                                        id='drive'
                                        label={
                                            <IconRadio
                                                text={'Google Drive'}
                                                icon={<Icon icon={'IcGoogleDrive'} size={48} />}
                                                google_drive_connected={is_authorised}
                                                onDriveConnect={onDriveConnect}
                                            />
                                        }
                                        value={save_types.GOOGLE_DRIVE}
                                        disabled={!is_authorised}
                                        className={classNames({
                                            'dc-radio-group__item-disabled': !is_authorised,
                                        })}
                                    />
                                </RadioGroup>
                            </div>
                        </div>
                        <div
                            className={classNames('modal__footer', {
                                'modal__footer--active-keyboard': is_onscreen_keyboard_active,
                            })}
                        >
                            <Button
                                type='button'
                                className='modal__footer--button'
                                text={localize('Cancel')}
                                onClick={toggleSaveModal}
                                secondary
                            />
                            <Button
                                className='modal__footer--button'
                                type='submit'
                                is_loading={button_status === 1}
                                is_submit_success={button_status === 2}
                                text={localize('Save')}
                                primary
                            />
                        </div>
                    </Form>
                </ThemedScrollbars>
            );
        }}
    </Formik>
);
const SaveModal = observer(() => {
    const { save_modal, google_drive } = useDBotStore();
    const { ui } = useStore();
    const { is_onscreen_keyboard_active, setCurrentFocus } = ui;
    const { is_authorised } = google_drive;
    const {
        button_status,
        is_save_modal_open,
        onConfirmSave,
        onDriveConnect,
        toggleSaveModal,
        validateBotName,
        bot_name,
    } = save_modal;
    const is_mobile = isMobile();
    return is_mobile ? (
        <MobileFullPageModal
            is_modal_open={is_save_modal_open}
            className='save-modal__wrapper'
            header={localize('Save bot')}
            onClickClose={toggleSaveModal}
            height_offset='80px'
            page_overlay
        >
            <SaveModalForm
                bot_name={bot_name}
                button_status={button_status}
                is_authorised={is_authorised}
                onConfirmSave={onConfirmSave}
                onDriveConnect={onDriveConnect}
                validateBotName={validateBotName}
                toggleSaveModal={toggleSaveModal}
                is_mobile={is_mobile}
                is_onscreen_keyboard_active={is_onscreen_keyboard_active}
                setCurrentFocus={setCurrentFocus}
            />
        </MobileFullPageModal>
    ) : (
        <Modal
            title={localize('Save bot')}
            className='modal--save'
            width='328px'
            height='500px'
            is_open={is_save_modal_open}
            toggleModal={toggleSaveModal}
        >
            <SaveModalForm
                bot_name={bot_name}
                button_status={button_status}
                is_authorised={is_authorised}
                onConfirmSave={onConfirmSave}
                onDriveConnect={onDriveConnect}
                validateBotName={validateBotName}
                toggleSaveModal={toggleSaveModal}
                setCurrentFocus={setCurrentFocus}
            />
        </Modal>
    );
});

const IconRadio = ({ icon, text, google_drive_connected, onDriveConnect }: TIconRadio) => {
    const is_drive_radio = text === 'Google Drive';

    return (
        <div className='save-type__container'>
            <div className='save-type__radio'>
                {icon &&
                    React.cloneElement(icon, {
                        className: classNames(
                            'save-type__icon',
                            {
                                'save-type__icon--active': is_drive_radio && google_drive_connected,
                                'save-type__icon--disabled': is_drive_radio && !google_drive_connected,
                            },
                            icon.props.className
                        ),
                    })}
                <Text
                    as='p'
                    align='center'
                    size='xxs'
                    color={is_drive_radio && !google_drive_connected ? 'disabled' : 'prominent'}
                    line_height='s'
                    className='save-type__radio-text'
                >
                    {localize(text)}
                </Text>
            </div>
            {is_drive_radio && (
                <Text
                    as='p'
                    align='center'
                    size='xs'
                    weight='bold'
                    styles={{ color: 'var(--brand-red-coral)' }}
                    className='save-type__drive-status'
                    onClick={onDriveConnect}
                >
                    {localize(google_drive_connected ? localize('Disconnect') : localize('Connect'))}
                </Text>
            )}
        </div>
    );
};

export default SaveModal;
