import React from 'react';
import { Localize } from '@deriv/translations';

const getOnfidoPhrases = () => ({
    country_select: {
        alert_dropdown: {
            country_not_found: <Localize i18n_default_text='Country not found' />,
        },
        alert: {
            another_doc: (
                <Localize i18n_default_text='Documents from that country are not currently supported — <fallback>try another document type</fallback>' />
            ),
        },
        button_primary: <Localize i18n_default_text='Submit document' />,
        search: {
            accessibility: <Localize i18n_default_text='Select country' />,
            input_placeholder: <Localize i18n_default_text='e.g. United States' />,
            label: <Localize i18n_default_text='Search for country' />,
        },
        title: <Localize i18n_default_text='Select issuing country' />,
    },
    cross_device_checklist: {
        button_primary: <Localize i18n_default_text='Submit verification' />,
        info: <Localize i18n_default_text='Tips' />,
        list_item_doc_multiple: <Localize i18n_default_text='Documents uploaded' />,
        list_item_doc_one: <Localize i18n_default_text='Document uploaded' />,
        list_item_selfie: <Localize i18n_default_text='Selfie uploaded' />,
        subtitle: <Localize i18n_default_text="We're now ready to verify your identity" />,
        title: <Localize i18n_default_text="Great, that's everything we need" />,
    },
    cross_device_error_desktop: {
        subtitle: <Localize i18n_default_text='The link only works on mobile devices' />,
        title: <Localize i18n_default_text="Something's gone wrong" />,
    },
    cross_device_error_restart: {
        subtitle: <Localize i18n_default_text="You'll need to restart your verification on your computer" />,
        title: <Localize i18n_default_text="Something's gone wrong" />,
    },
    cross_device_intro: {
        button_primary: <Localize i18n_default_text='Get secure link' />,
        list_accessibility: <Localize i18n_default_text='Steps required to continue verification on your mobile' />,
        list_item_finish: <Localize i18n_default_text='Check back here to finish the submission' />,
        list_item_open_link: <Localize i18n_default_text='Open the link and complete the tasks' />,
        list_item_send_phone: <Localize i18n_default_text='Send a secure link to your phone' />,
        subtitle: <Localize i18n_default_text="Here's how to do it:" />,
        title: <Localize i18n_default_text='Continue on your phone' />,
    },
    cross_device_return: {
        body: <Localize i18n_default_text='Your computer may take a few seconds to update' />,
        subtitle: <Localize i18n_default_text='You can now return to your computer to continue' />,
        title: <Localize i18n_default_text='Uploads successful' />,
    },
    doc_confirmation: {
        alert: {
            blur_detail: <Localize i18n_default_text='Make sure everything is clear' />,
            blur_title: <Localize i18n_default_text='Blurry photo detected' />,
            crop_detail: <Localize i18n_default_text='Make sure full document is visible' />,
            crop_title: <Localize i18n_default_text='Cut-off image detected' />,
            glare_detail: <Localize i18n_default_text='Move away from direct light' />,
            glare_title: <Localize i18n_default_text='Glare detected' />,
            no_doc_detail: <Localize i18n_default_text='Make sure all of the document is in the photo' />,
            no_doc_title: <Localize i18n_default_text='No document detected' />,
        },
        body_id: <Localize i18n_default_text='Make sure your card details are clear to read, with no blur or glare' />,
        body_image_medium: <Localize i18n_default_text='It’ll take longer to verify you if we can’t read it' />,
        body_image_poor: <Localize i18n_default_text='To smoothly verify you, we need a better photo' />,
        body_license: (
            <Localize i18n_default_text='Make sure your license details are clear to read, with no blur or glare' />
        ),
        body_passport: (
            <Localize i18n_default_text='Make sure your passport details are clear to read, with no blur or glare' />
        ),
        body_permit: (
            <Localize i18n_default_text='Make sure your permit details are clear to read, with no blur or glare' />
        ),
        body_tax_letter: <Localize i18n_default_text='Make sure details are clear to read, with no blur or glare' />,
        button_close: <Localize i18n_default_text='Close' />,
        button_primary_redo: <Localize i18n_default_text='Redo' />,
        button_primary_upload: <Localize i18n_default_text='Confirm' />,
        button_primary_upload_anyway: <Localize i18n_default_text='Upload anyway' />,
        button_secondary_redo: <Localize i18n_default_text='Redo' />,
        button_zoom: <Localize i18n_default_text='Enlarge image' />,
        image_accessibility: <Localize i18n_default_text='Photo of your document' />,
        title: <Localize i18n_default_text='Check your image' />,
    },
    doc_select: {
        button_id: <Localize i18n_default_text='Identity card' />,
        button_id_detail: <Localize i18n_default_text='Front and back' />,
        button_license: <Localize i18n_default_text="Driver's license" />,
        button_license_detail: <Localize i18n_default_text='Front and back' />,
        button_passport: <Localize i18n_default_text='Passport' />,
        button_passport_detail: <Localize i18n_default_text='Face photo page' />,
        button_permit: <Localize i18n_default_text='Residence permit' />,
        button_permit_detail: <Localize i18n_default_text='Front and back' />,
        extra_no_mobile: <Localize i18n_default_text='Sorry, no mobile phone bills' />,
        list_accessibility: <Localize i18n_default_text='Documents you can use to verify your identity' />,
        subtitle: <Localize i18n_default_text='It must be an official photo ID' />,
        subtitle_poa: (
            <Localize i18n_default_text='These are the documents most likely to show your current home address' />
        ),
        title: <Localize i18n_default_text='Choose document' />,
        title_poa: <Localize i18n_default_text='Select a %{country} document' />,
    },
    doc_submit: {
        button_link_upload: <Localize i18n_default_text='or upload photo – no scans or photocopies' />,
        button_primary: <Localize i18n_default_text='Continue on phone' />,
        subtitle: <Localize i18n_default_text='Take a photo with your phone' />,
        title_id_back: <Localize i18n_default_text='Submit identity card (back)' />,
        title_id_front: <Localize i18n_default_text='Submit identity card (front)' />,
        title_license_back: <Localize i18n_default_text='Submit license (back)' />,
        title_license_front: <Localize i18n_default_text='Submit license (front)' />,
        title_passport: <Localize i18n_default_text='Submit passport photo page' />,
        title_permit_back: <Localize i18n_default_text='Submit residence permit (back)' />,
        title_permit_front: <Localize i18n_default_text='Submit residence permit (front)' />,
    },
    error_unsupported_browser: {
        subtitle_android: <Localize i18n_default_text='Restart the process on the latest version of Google Chrome' />,
        subtitle_ios: <Localize i18n_default_text='Restart the process on the latest version of Safari' />,
        title_android: <Localize i18n_default_text='Unsupported browser' />,
        title_ios: <Localize i18n_default_text='Unsupported browser' />,
    },
    generic: {
        accessibility: {
            close_sdk_screen: <Localize i18n_default_text='Close identity verification screen' />,
            dismiss_alert: <Localize i18n_default_text='Dismiss alert' />,
        },
        back: <Localize i18n_default_text='back' />,
        close: <Localize i18n_default_text='close' />,
        errors: {
            interrupted_flow_error: {
                instruction: <Localize i18n_default_text='Restart process on a different device' />,
                message: <Localize i18n_default_text='Camera not detected' />,
            },
            invalid_size: {
                instruction: <Localize i18n_default_text='Must be under 10MB.' />,
                message: <Localize i18n_default_text='File size exceeded.' />,
            },
            invalid_type: {
                instruction: <Localize i18n_default_text='Try using another file type.' />,
                message: <Localize i18n_default_text='File not uploaded.' />,
            },
            lazy_loading: {
                message: <Localize i18n_default_text='An error occurred while loading the component' />,
            },
            multiple_faces: {
                instruction: <Localize i18n_default_text='Only your face can be in the selfie' />,
                message: <Localize i18n_default_text='Multiple faces found' />,
            },
            no_face: {
                instruction: <Localize i18n_default_text='Your face is needed in the selfie' />,
                message: <Localize i18n_default_text='No face found' />,
            },
            request_error: {
                instruction: <Localize i18n_default_text='Please try again' />,
                message: <Localize i18n_default_text='Connection lost' />,
            },
            sms_failed: {
                instruction: <Localize i18n_default_text='Copy the link to your phone' />,
                message: <Localize i18n_default_text="Something's gone wrong" />,
            },
            sms_overuse: {
                instruction: <Localize i18n_default_text='Copy the link to your phone' />,
                message: <Localize i18n_default_text='Too many failed attempts' />,
            },
            unsupported_file: {
                instruction: <Localize i18n_default_text='Try using a JPG or PNG file' />,
                message: <Localize i18n_default_text='File type not supported' />,
            },
        },
        lazy_load_placeholder: <Localize i18n_default_text='Loading...' />,
        loading: <Localize i18n_default_text='Loading' />,
    },
    get_link: {
        alert_wrong_number: <Localize i18n_default_text='Check that your number is correct' />,
        button_copied: <Localize i18n_default_text='Copied' />,
        button_copy: <Localize i18n_default_text='Copy' />,
        button_submit: <Localize i18n_default_text='Send link' />,
        info_qr_how: <Localize i18n_default_text='How to scan a QR code' />,
        info_qr_how_list_item_camera: <Localize i18n_default_text='Point your phone’s camera at the QR code' />,
        info_qr_how_list_item_download: (
            <Localize i18n_default_text='If it doesn’t work, download a QR code scanner from Google Play or the App Store' />
        ),
        link_divider: <Localize i18n_default_text='or' />,
        link_qr: <Localize i18n_default_text='Scan QR code' />,
        link_sms: <Localize i18n_default_text='Get link via SMS' />,
        link_url: <Localize i18n_default_text='Copy link' />,
        loader_sending: <Localize i18n_default_text='Sending' />,
        number_field_input_placeholder: <Localize i18n_default_text='Enter mobile number' />,
        number_field_label: <Localize i18n_default_text='Enter your mobile number:' />,
        subtitle_qr: <Localize i18n_default_text='Scan the QR code with your phone' />,
        subtitle_sms: <Localize i18n_default_text='Send this one-time link to your phone' />,
        subtitle_url: <Localize i18n_default_text='Open the link on your mobile' />,
        title: <Localize i18n_default_text='Get your secure link' />,
        url_field_label: <Localize i18n_default_text='Copy the link to your mobile browser' />,
    },
    linked_computer: {
        button_primary: <Localize i18n_default_text='Continue' />,
        info: <Localize i18n_default_text='Make sure§' />,
        list_item_desktop_open: <Localize i18n_default_text='2. Your desktop window stays open' />,
        list_item_sent_by_you: <Localize i18n_default_text='1. This link was sent by you' />,
        subtitle: <Localize i18n_default_text='Continue with the verification' />,
        title: <Localize i18n_default_text='Linked to your computer' />,
    },
    mobilePhrases: {
        photo_upload: {
            body_id_back: <Localize i18n_default_text='Take a photo of the back of your card' />,
            body_id_front: <Localize i18n_default_text='Take a photo of the front of your card' />,
            body_license_back: <Localize i18n_default_text='Take a photo of the back of your license' />,
            body_license_front: <Localize i18n_default_text='Take a photo of the front of your license' />,
            body_passport: <Localize i18n_default_text='Take a photo of your passport photo page' />,
            body_selfie: <Localize i18n_default_text='Take a selfie showing your face' />,
        },
        selfie_capture: {
            alert: {
                camera_inactive: {
                    detail: (
                        <Localize i18n_default_text='Take a photo using the <fallback>basic camera mode</fallback> instead' />
                    ),
                },
                camera_not_working: {
                    detail: (
                        <Localize i18n_default_text='Take a photo using the <fallback>basic camera mode</fallback> instead' />
                    ),
                },
            },
        },
        upload_guide: {
            button_primary: <Localize i18n_default_text='Take a photo' />,
            title: <Localize i18n_default_text='Passport photo page' />,
        },
    },
    outro: {
        body: <Localize i18n_default_text='Thank you' />,
        title: <Localize i18n_default_text='Verification complete' />,
    },
    permission_recovery: {
        button_primary: <Localize i18n_default_text='Refresh' />,
        info: <Localize i18n_default_text='Recovery' />,
        list_header_cam: <Localize i18n_default_text='Follow these steps to recover camera access:' />,
        list_item_action_cam: (
            <Localize i18n_default_text='Refresh this page to restart the identity verification process' />
        ),
        list_item_how_to_cam: <Localize i18n_default_text='Grant access to your camera from your browser settings' />,
        subtitle_cam: <Localize i18n_default_text='Recover camera access to continue face verification' />,
        title_cam: <Localize i18n_default_text='Camera access is denied' />,
    },
    permission: {
        body_cam: <Localize i18n_default_text='We cannot verify you without using your camera' />,
        button_primary_cam: <Localize i18n_default_text='Enable camera' />,
        subtitle_cam: <Localize i18n_default_text='When prompted, you must enable camera access to continue' />,
        title_cam: <Localize i18n_default_text='Allow camera access' />,
    },
    photo_upload: {
        body_bank_statement: <Localize i18n_default_text='Provide the whole document page for best results' />,
        body_benefits_letter: <Localize i18n_default_text='Provide the whole document page for best results' />,
        body_bill: <Localize i18n_default_text='Provide the whole document page for best results' />,
        body_government_letter: <Localize i18n_default_text='Provide the whole document page for best results' />,
        body_id_back: <Localize i18n_default_text='Upload back of card from your computer' />,
        body_id_front: <Localize i18n_default_text='Upload front of card from your computer' />,
        body_license_back: <Localize i18n_default_text='Upload back of license from your computer' />,
        body_license_front: <Localize i18n_default_text='Upload front of license from your computer' />,
        body_passport: <Localize i18n_default_text='Upload passport photo page from your computer' />,
        body_selfie: <Localize i18n_default_text='Upload a selfie from your computer' />,
        body_tax_letter: <Localize i18n_default_text='Provide the whole document page for best results' />,
        button_take_photo: <Localize i18n_default_text='Take photo' />,
        button_upload: <Localize i18n_default_text='Upload' />,
        title_selfie: <Localize i18n_default_text='Selfie' />,
    },
    selfie_capture: {
        alert: {
            camera_inactive: {
                detail: (
                    <Localize i18n_default_text='Check that it is connected and functional. You can also <fallback>continue verification on your phone</fallback>' />
                ),
                detail_no_fallback: <Localize i18n_default_text='Make sure your device has a working camera' />,
                title: <Localize i18n_default_text='Camera not working?' />,
            },
            camera_not_working: {
                detail: (
                    <Localize i18n_default_text='It may be disconnected. <fallback>Try using your phone instead</fallback>.' />
                ),
                detail_no_fallback: <Localize i18n_default_text="Make sure your device's camera works" />,
                title: <Localize i18n_default_text='Camera not working' />,
            },
            timeout: {
                detail: (
                    <Localize i18n_default_text="Remember to press stop when you're done. <fallback>Redo video actions</fallback>" />
                ),
                title: <Localize i18n_default_text='Looks like you took too long' />,
            },
        },
        button_accessibility: <Localize i18n_default_text='Take a photo' />,
        frame_accessibility: <Localize i18n_default_text='View from camera' />,
        title: <Localize i18n_default_text='Take a selfie' />,
    },
    selfie_confirmation: {
        image_accessibility: <Localize i18n_default_text='Photo of your face' />,
        subtitle: <Localize i18n_default_text='Make sure your selfie clearly shows your face' />,
        title: <Localize i18n_default_text='Check selfie' />,
    },
    selfie_intro: {
        button_primary: <Localize i18n_default_text='Continue' />,
        list_accessibility: <Localize i18n_default_text='Tips to take a good selfie' />,
        list_item_face_forward: (
            <Localize i18n_default_text='Face forward and make sure your eyes are clearly visible' />
        ),
        list_item_no_glasses: <Localize i18n_default_text='Remove your glasses, if necessary' />,
        subtitle: <Localize i18n_default_text="We'll compare it with your document" />,
        title: <Localize i18n_default_text='Take a selfie' />,
    },
    sms_sent: {
        info: <Localize i18n_default_text='Tips' />,
        info_link_expire: <Localize i18n_default_text='Your link will expire in one hour' />,
        info_link_window: <Localize i18n_default_text='Keep this window open while using your mobile' />,
        link: <Localize i18n_default_text='Resend link' />,
        subtitle: <Localize i18n_default_text="We've sent a secure link to %{number}" />,
        subtitle_minutes: <Localize i18n_default_text='It may take a few minutes to arrive' />,
        title: <Localize i18n_default_text='Check your mobile' />,
    },
    switch_phone: {
        info: <Localize i18n_default_text='Tips' />,
        info_link_expire: <Localize i18n_default_text='Your mobile link will expire in one hour' />,
        info_link_refresh: <Localize i18n_default_text="Don't refresh this page" />,
        info_link_window: <Localize i18n_default_text='Keep this window open while using your mobile' />,
        link: <Localize i18n_default_text='Cancel' />,
        subtitle: <Localize i18n_default_text="Once you\'ve finished we'll take you to the next step" />,
        title: <Localize i18n_default_text='Connected to your mobile' />,
    },
    upload_guide: {
        button_primary: <Localize i18n_default_text='Upload photo' />,
        image_detail_blur_alt: <Localize i18n_default_text='Example of a blurry document' />,
        image_detail_blur_label: <Localize i18n_default_text='All details must be clear — nothing blurry' />,
        image_detail_cutoff_alt: <Localize i18n_default_text='Example of a cut-off document' />,
        image_detail_cutoff_label: <Localize i18n_default_text='Show all details — including the bottom 2 lines' />,
        image_detail_glare_alt: <Localize i18n_default_text='Example of a document with glare' />,
        image_detail_glare_label: <Localize i18n_default_text='Move away from direct light — no glare' />,
        image_detail_good_alt: <Localize i18n_default_text='Document example' />,
        image_detail_good_label: <Localize i18n_default_text='The photo should clearly show your document' />,
        subtitle: <Localize i18n_default_text='Scans and photocopies are not accepted' />,
        title: <Localize i18n_default_text='Upload passport photo page' />,
    },
});

export default getOnfidoPhrases;
