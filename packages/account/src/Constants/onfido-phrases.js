import { localize } from '@deriv/translations';

const getOnfidoPhrases = () => ({
    accessibility: {
        camera_view: localize('View from camera'),
        close_sdk_screen: localize('Close identity verification screen'),
        country_select: localize('Select country'),
        cross_device_verification: localize('Steps required to continue verification on your mobile'),
        dismiss_alert: localize('Dismiss alert'),
        document_types: localize('Documents you can use to verify your identity'),
        shutter: localize('Take a photo'),
    },
    back: localize('back'),
    cancel: localize('Cancel'),
    capture: {
        driving_licence: {
            back: {
                instructions: localize('Upload back of license from your computer'),
                title: localize('Submit license (back)'),
                webcam: localize('Position the back of license in the frame (it will be automatically detected)'),
            },
            front: {
                instructions: localize('Upload front of license from your computer'),
                title: localize('Submit license (front)'),
                webcam: localize('Position the front of license in the frame (it will be automatically detected)'),
            },
        },
        face: {
            instructions: localize('Upload a selfie from your computer'),
            intro: {
                accessibility: {
                    selfie_capture_tips: localize('Tips to take a good selfie'),
                },
                glasses_instruction: localize('Remove your glasses, if necessary'),
                selfie_instruction: localize('Face forward and make sure your eyes are clearly visible'),
                subtitle: localize("We'll compare it with your document"),
                title: localize('Take a selfie'),
            },
            title: localize('Take a selfie'),
            upload_title: localize('Selfie'),
        },
        national_identity_card: {
            back: {
                instructions: localize('Upload back of card from your computer'),
                title: localize('Submit identity card (back)'),
                webcam: localize('Position the back of card in the frame (it will be automatically detected)'),
            },
            front: {
                instructions: localize('Upload front of card from your computer'),
                title: localize('Submit identity card (front)'),
                webcam: localize('Position the front of card in the frame (it will be automatically detected)'),
            },
        },
        passport: {
            front: {
                instructions: localize('Upload passport photo page from your computer'),
                title: localize('Submit passport photo page'),
                webcam: localize('Position your passport photo page in the frame (it will be automatically detected)'),
            },
        },
        switch_device: localize('Continue on phone'),
        take_photo: localize('Take photo'),
        upload_document: localize('Upload'),
        upload_file: localize('or upload photo – no scans or photocopies'),
    },
    close: localize('close'),
    complete: {
        message: localize('Verification complete'),
        submessage: localize('Thank you'),
    },
    confirm: {
        confirm: localize('Confirm'),
        continue: localize('Continue'),
        document: {
            alt: localize('Photo of your document'),
            title: localize('Check readability'),
        },
        driving_licence: {
            message: localize('Make sure your license details are clear to read, with no blur or glare'),
        },
        enlarge_image: {
            close: localize('Close'),
            enlarge: localize('Enlarge image'),
        },
        face: {
            standard: {
                alt: localize('Photo of your face'),
                message: localize('Make sure your selfie clearly shows your face'),
                title: localize('Check selfie'),
            },
        },
        national_identity_card: {
            message: localize('Make sure your card details are clear to read, with no blur or glare'),
        },
        passport: {
            message: localize('Make sure your passport details are clear to read, with no blur or glare'),
        },
        redo: localize('Redo'),
    },
    continue: localize('Continue'),
    cross_device: {
        client_success: {
            body: localize('Your computer may take a few seconds to update'),
            sub_title: localize('You can now return to your computer to continue'),
            title: localize('Uploads successful'),
        },
        intro: {
            action: localize('Get secure link'),
            description_li_1: localize('Send a secure link to your phone'),
            description_li_2: localize('Open the link and complete the tasks'),
            description_li_3: localize('Check back here to finish the submission'),
            sub_title: localize("Here's how to do it:"),
            title: localize('Continue on your phone'),
        },
        link: {
            button_copy: {
                action: localize('Send link'),
                status: localize('Sending'),
            },
            copy_link_label: localize('Copy the link to your mobile browser'),
            copy_link_option: localize('Copy link'),
            copy_link_sub_title: localize('Open the link on your mobile'),
            copy_link: {
                action: localize('Copy'),
                success: localize('Copied'),
            },
            options_divider_label: localize('or'),
            qr_code_option: localize('Scan QR code'),
            qr_code_sub_title: localize('Scan the QR code with your phone'),
            qr_code: {
                help_label: localize('How to scan a QR code'),
                help_step_1: localize('Point your phone’s camera at the QR code'),
                help_step_2: localize(
                    'If it doesn’t work, download a QR code scanner from Google Play or the App Store'
                ),
            },
            sms_label: localize('Enter your mobile number:'),
            sms_option: localize('Get link via SMS'),
            sms_sub_title: localize('Send this one-time link to your phone'),
            title: localize('Get your secure link'),
        },
        loading: localize('Loading...'),
        mobile_connected: {
            tips: {
                item_1: localize('Keep this window open while using your mobile'),
                item_2: localize('Your mobile link will expire in one hour'),
                item_3: localize("Don't refresh this page"),
            },
            title: {
                message: localize('Connected to your mobile'),
                submessage: localize("Once you've finished we'll take you to the next step"),
            },
        },
        mobile_notification_sent: {
            bold_message: localize('It may take a few minutes to arrive'),
            resend_link: localize('Resend link'),
            submessage: localize("We've sent a secure link to %{number}"),
            tips: {
                item_1: localize('Keep this window open while using your mobile'),
                item_2: localize('Your link will expire in one hour'),
            },
            title: localize('Check your mobile'),
        },
        phone_number_placeholder: localize('Enter mobile number'),
        submit: {
            action: localize('Submit verification'),
            multiple_docs_uploaded: localize('Documents uploaded'),
            one_doc_uploaded: localize('Document uploaded'),
            selfie_uploaded: localize('Selfie uploaded'),
            sub_title: localize("We're now ready to verify your identity"),
            title: localize("Great, that's everything we need"),
            video_uploaded: localize('Video uploaded'),
        },
        switch_device: {
            header: localize('Take a photo with your phone'),
        },
        tips: localize('Tips'),
    },
    document_selector: {
        identity: {
            driving_licence_hint: localize('Front and back'),
            hint: localize('Select the type of document you would like to upload'),
            national_identity_card_hint: localize('Front and back'),
            passport_hint: localize('Face photo page'),
            title: localize('Verify your identity'),
        },
    },
    driving_licence: localize("Driver's license"),
    errors: {
        camera_inactive_no_fallback: {
            instruction: localize('Make sure your device has a working camera'),
        },
        camera_inactive: {
            instruction: localize(
                'Check that it is connected and functional. You can also <fallback>continue verification on your phone</fallback>'
            ),
            message: localize('Camera not working?'),
        },
        camera_not_working_no_fallback: {
            instruction: localize("Make sure your device's camera works"),
        },
        camera_not_working: {
            instruction: localize('It may be disconnected. <fallback>Try using your phone instead</fallback>.'),
            message: localize('Camera not working'),
        },
        forbidden_client_error: {
            instruction: localize('The link only works on mobile devices'),
            message: localize("Something's gone wrong"),
        },
        generic_client_error: {
            instruction: localize("You'll need to restart your verification on your computer"),
            message: localize("Something's gone wrong"),
        },
        glare_detected: {
            instruction: localize('All details should be clear and readable'),
            message: localize('Glare detected'),
        },
        interrupted_flow_error: {
            instruction: localize('Restart process on a different device'),
            message: localize('Camera not detected'),
        },
        invalid_capture: {
            instruction: localize('Make sure all of the document is in the photo'),
            message: localize('No document detected'),
        },
        invalid_number: {
            message: localize('Check that your number is correct'),
        },
        invalid_size: {
            instruction: localize('Must be under 10MB.'),
            message: localize('File size exceeded.'),
        },
        invalid_type: {
            instruction: localize('Try using another file type.'),
            message: localize('File not uploaded.'),
        },
        lazy_loading: {
            message: localize('An error occurred while loading the component'),
        },
        multiple_faces: {
            instruction: localize('Only your face can be in the selfie'),
            message: localize('Multiple faces found'),
        },
        no_face: {
            instruction: localize('Your face is needed in the selfie'),
            message: localize('No face found'),
        },
        server_error: {
            instruction: localize('Please try again'),
            message: localize('Connection lost'),
        },
        sms_failed: {
            instruction: localize('Copy the link to your phone'),
            message: localize("Something's gone wrong"),
        },
        sms_overuse: {
            instruction: localize('Copy the link to your phone'),
            message: localize('Too many failed attempts'),
        },
        unsupported_android_browser: {
            instruction: localize('Restart the process on the latest version of Google Chrome'),
            message: localize('Unsupported browser'),
        },
        unsupported_file: {
            instruction: localize('Try using a JPG or PNG file'),
            message: localize('File type not supported'),
        },
        unsupported_ios_browser: {
            instruction: localize('Restart the process on the latest version of Safari'),
            message: localize('Unsupported browser'),
        },
    },
    image_quality_guide: {
        all_good: {
            image_alt_text: localize('Document example'),
            label: localize('This is good'),
        },
        next_step: localize('Upload photo'),
        no_blur: {
            image_alt_text: localize('Example of a blurry document'),
            label: localize('All details must be clear'),
        },
        no_glare: {
            image_alt_text: localize('Example of a document with glare'),
            label: localize('Move away from direct light'),
        },
        not_cut_off: {
            image_alt_text: localize('Example of a cut-off document'),
            label: localize('Show all details — including the bottom 2 lines'),
        },
        sub_title: localize('Scans and photocopies are not accepted'),
        title: localize('Upload passport photo page'),
    },
    loading: localize('Loading'),
    mobilePhrases: {
        capture: {
            driving_licence: {
                back: {
                    instructions: localize('Take a photo of the back of your license'),
                },
                front: {
                    instructions: localize('Take a photo of the front of your license'),
                },
            },
            face: {
                instructions: localize('Take a selfie showing your face'),
            },
            national_identity_card: {
                back: {
                    instructions: localize('Take a photo of the back of your card'),
                },
                front: {
                    instructions: localize('Take a photo of the front of your card'),
                },
            },
            passport: {
                front: {
                    instructions: localize('Take a photo of your passport photo page'),
                },
            },
        },
        errors: {
            camera_inactive: {
                instruction: localize('Take a photo using the <fallback>basic camera mode</fallback> instead'),
            },
            camera_not_working: {
                instruction: localize('Take a photo using the <fallback>basic camera mode</fallback> instead'),
            },
        },
        image_quality_guide: {
            next_step: localize('Take a photo'),
            title: localize('Passport photo page'),
        },
    },
    national_identity_card: localize('Identity Card'),
    passport: localize('Passport'),
    short_driving_licence: localize('license'),
    short_national_identity_card: localize('card'),
    short_passport: localize('passport'),
    SMS_BODY: localize('Continue your identity verification by tapping'),
    webcam_permissions: {
        access_denied: localize('Camera access is denied'),
        allow: localize('Allow'),
        allow_access: localize('Allow camera access'),
        click_allow: localize('We cannot verify you without using your camera'),
        enable_webcam: localize('Enable camera'),
        enable_webcam_for_selfie: localize('When prompted, you must enable camera access to continue'),
        follow_steps: localize('Follow these steps to recover camera access:'),
        grant_access: localize('Grant access to your camera from your browser settings'),
        if_denied: localize(
            "If you deny camera access, you won't be able to take pictures and complete verification process."
        ),
        recover_access: localize('Recover camera access to continue face verification'),
        recovery: localize('Recovery'),
        refresh: localize('Refresh'),
        refresh_page: localize('Refresh this page to restart the identity verification process'),
        why: localize('Why do I need to do this?'),
    },
    welcome: {
        description_p_1: localize('To open a bank account, we will need to verify your identity.'),
        description_p_2: localize('It will only take a couple of minutes.'),
        next_button: localize('Verify Identity'),
        title: localize('Open your new bank account'),
    },
});

export default getOnfidoPhrases;
