import React from 'react';
import classNames from 'classnames';
import {
    Button,
    Checkbox,
    Icon,
    Modal,
    RadioGroup,
    Input,
    MobileFullPageModal,
    ThemedScrollbars,
    Text,
} from '@deriv/components';
import { Formik, Form, Field } from 'formik';
import { Localize, localize } from '@deriv/translations';
import { config, save_types } from '@deriv/bot-skeleton';
import { connect } from 'Stores/connect';
import IconRadio from './icon-radio';
import { isMobile } from '@deriv/shared';

type TSaveModalForm = {
    bot_name: string;
    button_status: number;
    google_drive_connected?: boolean;
    is_authorised: boolean;
    is_mobile?: boolean;
    is_onscreen_keyboard_active?: boolean;
    is_save_modal_open?: boolean;
    icon?: string;
    text?: string;
    onConfirmSave: () => void;
    onDriveConnect: () => void;
    toggleSaveModal: () => void;
    setCurrentFocus: () => void;
    validateBotName: () => void;
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
        {({ values: { is_local, save_as_collection }, setFieldValue, touched, errors }) => {
            const content_height = !is_mobile ? '500px' : `calc(100%)`;
            return (
                <ThemedScrollbars height={content_height} autohide>
                    <Form className={classNames({ 'form--active-keyboard': is_onscreen_keyboard_active })}>
                        <div className='modal__content'>
                            <div className='modal__content-row'>
                                <Field name='bot_name'>
                                    {({ field }) => (
                                        <Input
                                            className='save-type__input'
                                            type='text'
                                            placeholder={localize('Untitled Strategy')}
                                            error={touched[field.name] && errors[field.name]}
                                            label={localize('Strategy name')}
                                            onFocus={e => setCurrentFocus(e.currentTarget.name)}
                                            onBlur={() => setCurrentFocus(null)}
                                            {...field}
                                        />
                                    )}
                                </Field>
                            </div>
                            <div className='modal__content-row'>
                                <RadioGroup
                                    className='radio-group__save-type'
                                    name='is_local'
                                    selected={() => {
                                        if (is_authorised && !is_local) return save_types.GOOGLE_DRIVE;
                                        return save_types.LOCAL;
                                    }}
                                    onToggle={() => setFieldValue('is_local', !is_local)}
                                >
                                    <RadioGroup.Item
                                        id='local'
                                        label={
                                            <IconRadio
                                                text={localize('Local')}
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
                            <>
                                <Field name='save_as_collection'>
                                    {({ field }) => (
                                        <Checkbox
                                            onChange={() => setFieldValue('save_as_collection', !save_as_collection)}
                                            defaultChecked={save_as_collection}
                                            label={
                                                <Text size='xs' line_height='s' weight='bold'>
                                                    <Localize i18n_default_text='Save as collection' />
                                                </Text>
                                            }
                                            classNameLabel='save-type__checkbox-text'
                                            {...field}
                                        />
                                    )}
                                </Field>
                                <div className='save-type__checkbox-description'>
                                    {localize(
                                        'Enabling this allows you to save your blocks as one collection which can be easily integrated into other bots.'
                                    )}
                                </div>
                            </>
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
                                text={localize('Continue')}
                                primary
                            />
                        </div>
                    </Form>
                </ThemedScrollbars>
            );
        }}
    </Formik>
);
const SaveModal = ({
    bot_name,
    button_status,
    is_authorised,
    is_save_modal_open,
    onConfirmSave,
    onDriveConnect,
    toggleSaveModal,
    validateBotName,
    setCurrentFocus,
    is_onscreen_keyboard_active,
}: TSaveModalForm) => {
    const is_mobile = isMobile();
    return is_mobile ? (
        <MobileFullPageModal
            is_modal_open={is_save_modal_open}
            className='save-modal__wrapper'
            header={localize('Save strategy')}
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
            title={localize('Save Strategy')}
            className='modal--save'
            width='32.8rem'
            height='50rem'
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
};

export default connect(({ save_modal, google_drive, ui }) => ({
    button_status: save_modal.button_status,
    is_authorised: google_drive.is_authorised,
    is_save_modal_open: save_modal.is_save_modal_open,
    is_onscreen_keyboard_active: ui.is_onscreen_keyboard_active,
    onConfirmSave: save_modal.onConfirmSave,
    onDriveConnect: save_modal.onDriveConnect,
    toggleSaveModal: save_modal.toggleSaveModal,
    validateBotName: save_modal.validateBotName,
    bot_name: save_modal.bot_name,
    setCurrentFocus: ui.setCurrentFocus,
}))(SaveModal);
