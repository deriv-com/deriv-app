import React from 'react';
import { Localize } from '@deriv/translations';

const onfido_phrases = {
    accessibility: {
        camera_view: <Localize i18n_default_text='View from camera' />,
        close_sdk_screen: <Localize i18n_default_text='Close identity verification screen' />,
        country_select: <Localize i18n_default_text='Select country' />,
        cross_device_verification: (
            <Localize i18n_default_text='Steps required to continue verification on your mobile' />
        ),
        dismiss_alert: <Localize i18n_default_text='Dismiss alert' />,
        document_types: <Localize i18n_default_text='Documents you can use to verify your identity' />,
        replay_video: <Localize i18n_default_text='Replay your recorded video' />,
        selfie_video_actions: <Localize i18n_default_text='Actions to record a selfie video' />,
        shutter: <Localize i18n_default_text='Take a photo' />,
        start_recording: <Localize i18n_default_text='Start recording' />,
        stop_recording: <Localize i18n_default_text='Stop recording' />,
    },
    back: <Localize i18n_default_text='back' />,
    bank_building_society_statement: <Localize i18n_default_text='Bank or building society statement' />,
    benefit_letters: <Localize i18n_default_text='Benefits Letter' />,
    cancel: <Localize i18n_default_text='Cancel' />,
    capture: {
        bank_building_society_statement: {
            front: {
                instructions: <Localize i18n_default_text='Provide the whole document page for best results' />,
                sub_title: <Localize i18n_default_text='Must be issued in the <strong>last 3 months</strong>' />,
                title: <Localize i18n_default_text='Submit statement' />,
                webcam: (
                    <Localize i18n_default_text='Position your bank statement in the frame (it will be automatically detected)' />
                ),
            },
        },
        benefit_letters: {
            front: {
                instructions: <Localize i18n_default_text='Provide the whole document page for best results' />,
                sub_title: <Localize i18n_default_text='Must be issued in the <strong>last 12 months</strong>' />,
                title: <Localize i18n_default_text='Submit letter' />,
                webcam: (
                    <Localize i18n_default_text='Position your benefits letter in the frame (it will be automatically detected)' />
                ),
            },
        },
        council_tax: {
            front: {
                instructions: <Localize i18n_default_text='Provide the whole document page for best results' />,
                sub_title: <Localize i18n_default_text='Must be issued in the <strong>last 12 months</strong>' />,
                title: <Localize i18n_default_text='Submit letter' />,
                webcam: (
                    <Localize i18n_default_text='Position your council tax letter in the frame (it will be automatically detected)' />
                ),
            },
        },
        driving_licence: {
            back: {
                instructions: <Localize i18n_default_text='Upload back of license from your computer' />,
                title: <Localize i18n_default_text='Submit license (back)' />,
                webcam: (
                    <Localize i18n_default_text='Position the back of license in the frame (it will be automatically detected)' />
                ),
            },
            front: {
                instructions: <Localize i18n_default_text='Upload front of license from your computer' />,
                title: <Localize i18n_default_text='Submit license (front)' />,
                webcam: (
                    <Localize i18n_default_text='Position the front of license in the frame (it will be automatically detected)' />
                ),
            },
        },
        face: {
            instructions: <Localize i18n_default_text='Upload a selfie from your computer' />,
            intro: {
                accessibility: {
                    selfie_capture_tips: <Localize i18n_default_text='Tips to take a good selfie' />,
                },
                glasses_instruction: <Localize i18n_default_text='Remove your glasses, if necessary' />,
                selfie_instruction: (
                    <Localize i18n_default_text='Face forward and make sure your eyes are clearly visible' />
                ),
                subtitle: <Localize i18n_default_text="We'll compare it with your document" />,
                title: <Localize i18n_default_text='Take a selfie' />,
            },
            title: <Localize i18n_default_text='Take a selfie' />,
            upload_title: <Localize i18n_default_text='Selfie' />,
        },
        government_letter: {
            front: {
                instructions: <Localize i18n_default_text='Provide the whole document page for best results' />,
                sub_title: <Localize i18n_default_text='Must be issued in the <strong>last 12 months</strong>' />,
                title: <Localize i18n_default_text='Government Letter' />,
                webcam: (
                    <Localize i18n_default_text='Position your government letter in the frame (it will be automatically detected)' />
                ),
            },
        },
        liveness: {
            challenges: {
                done_next: <Localize i18n_default_text="When you're done, press next" />,
                done_stop: <Localize i18n_default_text="When you're done, press stop" />,
                left: <Localize i18n_default_text='left' />,
                movement: <Localize i18n_default_text='Look over your %{side} shoulder' />,
                next: <Localize i18n_default_text='Next' />,
                position_face: <Localize i18n_default_text='Position your face in the oval' />,
                recite: <Localize i18n_default_text='Say each digit out loud' />,
                right: <Localize i18n_default_text='right' />,
            },
            intro: {
                continue: <Localize i18n_default_text='Continue' />,
                speak_out_loud: <Localize i18n_default_text='One will involve <strong>speaking out loud</strong>' />,
                title: <Localize i18n_default_text="Let's make sure nobody's impersonating you" />,
                two_actions: (
                    <Localize i18n_default_text="We'll ask you to film yourself performing <strong>2 simple actions</strong>" />
                ),
            },
            press_record: <Localize i18n_default_text='Press record and follow the instructions' />,
            recording: <Localize i18n_default_text='Recording' />,
            start: <Localize i18n_default_text='Start' />,
            stop: <Localize i18n_default_text='Stop' />,
        },
        national_identity_card: {
            back: {
                instructions: <Localize i18n_default_text='Upload back of card from your computer' />,
                title: <Localize i18n_default_text='Submit identity card (back)' />,
                webcam: (
                    <Localize i18n_default_text='Position the back of card in the frame (it will be automatically detected)' />
                ),
            },
            front: {
                instructions: <Localize i18n_default_text='Upload front of card from your computer' />,
                title: <Localize i18n_default_text='Submit identity card (front)' />,
                webcam: (
                    <Localize i18n_default_text='Position the front of card in the frame (it will be automatically detected)' />
                ),
            },
        },
        passport: {
            front: {
                instructions: <Localize i18n_default_text='Upload passport photo page from your computer' />,
                title: <Localize i18n_default_text='Submit passport photo page' />,
                webcam: (
                    <Localize i18n_default_text='Position your passport photo page in the frame (it will be automatically detected)' />
                ),
            },
        },
        switch_device: <Localize i18n_default_text='Continue on phone' />,
        take_photo: <Localize i18n_default_text='Take photo' />,
        upload_document: <Localize i18n_default_text='Upload' />,
        upload_file: <Localize i18n_default_text='or upload photo – no scans or photocopies' />,
        utility_bill: {
            front: {
                instructions: <Localize i18n_default_text='Provide the whole document page for best results' />,
                sub_title: <Localize i18n_default_text='Must be issued in the <strong>last 3 months</strong>' />,
                title: <Localize i18n_default_text='Submit bill' />,
                webcam: (
                    <Localize i18n_default_text='Position your utility bill in the frame (it will be automatically detected)' />
                ),
            },
        },
    },
    close: <Localize i18n_default_text='close' />,
    complete: {
        message: <Localize i18n_default_text='Verification complete' />,
        submessage: <Localize i18n_default_text='Thank you' />,
    },
    confirm: {
        bank_building_society_statement: {
            message: <Localize i18n_default_text='Make sure details are clear to read, with no blur or glare' />,
        },
        benefit_letters: {
            message: <Localize i18n_default_text='Make sure details are clear to read, with no blur or glare' />,
        },
        confirm: <Localize i18n_default_text='Confirm' />,
        continue: <Localize i18n_default_text='Continue' />,
        council_tax: {
            message: <Localize i18n_default_text='Make sure details are clear to read, with no blur or glare' />,
        },
        document: {
            alt: <Localize i18n_default_text='Photo of your document' />,
            title: <Localize i18n_default_text='Check readability' />,
        },
        driving_licence: {
            message: (
                <Localize i18n_default_text='Make sure your license details are clear to read, with no blur or glare' />
            ),
        },
        enlarge_image: {
            close: <Localize i18n_default_text='Close' />,
            enlarge: <Localize i18n_default_text='Enlarge image' />,
        },
        face: {
            standard: {
                alt: <Localize i18n_default_text='Photo of your face' />,
                message: <Localize i18n_default_text='Make sure your selfie clearly shows your face' />,
                title: <Localize i18n_default_text='Check selfie' />,
            },
            video: {
                title: <Localize i18n_default_text='Check selfie video' />,
            },
        },
        national_identity_card: {
            message: (
                <Localize i18n_default_text='Make sure your card details are clear to read, with no blur or glare' />
            ),
        },
        passport: {
            message: (
                <Localize i18n_default_text='Make sure your passport details are clear to read, with no blur or glare' />
            ),
        },
        redo: <Localize i18n_default_text='Redo' />,
        utility_bill: {
            message: <Localize i18n_default_text='Make sure details are clear to read, with no blur or glare' />,
        },
    },
    continue: <Localize i18n_default_text='Continue' />,
    council_tax: <Localize i18n_default_text='Council Tax Letter' />,
    cross_device: {
        client_success: {
            body: <Localize i18n_default_text='Your computer may take a few seconds to update' />,
            sub_title: <Localize i18n_default_text='You can now return to your computer to continue' />,
            title: <Localize i18n_default_text='Uploads successful' />,
        },
        intro: {
            action: <Localize i18n_default_text='Get secure link' />,
            description_li_1: <Localize i18n_default_text='Send a secure link to your phone' />,
            description_li_2: <Localize i18n_default_text='Open the link and complete the tasks' />,
            description_li_3: <Localize i18n_default_text='Check back here to finish the submission' />,
            sub_title: <Localize i18n_default_text="Here's how to do it:" />,
            title: <Localize i18n_default_text='Continue on your phone' />,
        },
        link: {
            button_copy: {
                action: <Localize i18n_default_text='Send link' />,
                status: <Localize i18n_default_text='Sending' />,
            },
            copy_link_label: <Localize i18n_default_text='Copy the link to your mobile browser' />,
            copy_link_option: <Localize i18n_default_text='Copy link' />,
            copy_link_sub_title: <Localize i18n_default_text='Open the link on your mobile' />,
            copy_link: {
                action: <Localize i18n_default_text='Copy' />,
                success: <Localize i18n_default_text='Copied' />,
            },
            options_divider_label: <Localize i18n_default_text='or' />,
            qr_code_option: <Localize i18n_default_text='Scan QR code' />,
            qr_code_sub_title: <Localize i18n_default_text='Scan the QR code with your phone' />,
            qr_code: {
                help_label: <Localize i18n_default_text='How to scan a QR code' />,
                help_step_1: <Localize i18n_default_text='Point your phone’s camera at the QR code' />,
                help_step_2: (
                    <Localize i18n_default_text='If it doesn’t work, download a QR code scanner from Google Play or the App Store' />
                ),
            },
            sms_label: <Localize i18n_default_text='Enter your mobile number:' />,
            sms_option: <Localize i18n_default_text='Get link via SMS' />,
            sms_sub_title: <Localize i18n_default_text='Send this one-time link to your phone' />,
            title: <Localize i18n_default_text='Get your secure link' />,
        },
        loading: <Localize i18n_default_text='Loading...' />,
        mobile_connected: {
            tips: {
                item_1: <Localize i18n_default_text='Keep this window open while using your mobile' />,
                item_2: <Localize i18n_default_text='Your mobile link will expire in one hour' />,
                item_3: <Localize i18n_default_text="Don't refresh this page" />,
            },
            title: {
                message: <Localize i18n_default_text='Connected to your mobile' />,
                submessage: <Localize i18n_default_text="Once you've finished we'll take you to the next step" />,
            },
        },
        mobile_notification_sent: {
            bold_message: <Localize i18n_default_text='It may take a few minutes to arrive' />,
            resend_link: <Localize i18n_default_text='Resend link' />,
            submessage: <Localize i18n_default_text="We've sent a secure link to %{number}" />,
            tips: {
                item_1: <Localize i18n_default_text='Keep this window open while using your mobile' />,
                item_2: <Localize i18n_default_text='Your link will expire in one hour' />,
            },
            title: <Localize i18n_default_text='Check your mobile' />,
        },
        phone_number_placeholder: <Localize i18n_default_text='Enter mobile number' />,
        submit: {
            action: <Localize i18n_default_text='Submit verification' />,
            multiple_docs_uploaded: <Localize i18n_default_text='Documents uploaded' />,
            one_doc_uploaded: <Localize i18n_default_text='Document uploaded' />,
            selfie_uploaded: <Localize i18n_default_text='Selfie uploaded' />,
            sub_title: <Localize i18n_default_text="We're now ready to verify your identity" />,
            title: <Localize i18n_default_text="Great, that's everything we need" />,
            video_uploaded: <Localize i18n_default_text='Video uploaded' />,
        },
        switch_device: {
            header: <Localize i18n_default_text='Take a photo with your phone' />,
        },
        tips: <Localize i18n_default_text='Tips' />,
    },
    document_selector: {
        identity: {
            driving_licence_hint: <Localize i18n_default_text='Front and back' />,
            hint: <Localize i18n_default_text='Select the type of document you would like to upload' />,
            national_identity_card_hint: <Localize i18n_default_text='Front and back' />,
            passport_hint: <Localize i18n_default_text='Face photo page' />,
            title: <Localize i18n_default_text='Verify your identity' />,
        },
        proof_of_address: {
            benefits_letter_hint: (
                <Localize i18n_default_text='Government authorised household benefits eg. Jobseeker allowance, Housing benefit, Tax credits' />
            ),
            estatements_accepted: <Localize i18n_default_text='e-statements accepted' />,
            government_letter_hint: (
                <Localize i18n_default_text='Any government issued letter eg. Benefits entitlement, Voting letters, Tax letters, etc' />
            ),
            hint: (
                <Localize i18n_default_text='These are the documents most likely to show your current home address' />
            ),
            title: <Localize i18n_default_text='Select a %{country} document' />,
            utility_bill_hint: <Localize i18n_default_text='Gas, electricity, water, landline, or broadband' />,
            utility_bill_warning: <Localize i18n_default_text='Sorry, no mobile phone bills' />,
        },
    },
    driving_licence: <Localize i18n_default_text="Driver's license" />,
    errors: {
        camera_inactive_no_fallback: {
            instruction: <Localize i18n_default_text='Make sure your device has a working camera' />,
        },
        camera_inactive: {
            instruction: (
                <Localize i18n_default_text='Check that it is connected and functional. You can also <fallback>continue verification on your phone</fallback>' />
            ),
            message: <Localize i18n_default_text='Camera not working?' />,
        },
        camera_not_working_no_fallback: {
            instruction: <Localize i18n_default_text="Make sure your device's camera works" />,
        },
        camera_not_working: {
            instruction: (
                <Localize i18n_default_text='It may be disconnected. <fallback>Try using your phone instead</fallback>.' />
            ),
            message: <Localize i18n_default_text='Camera not working' />,
        },
        forbidden_client_error: {
            instruction: <Localize i18n_default_text='The link only works on mobile devices' />,
            message: <Localize i18n_default_text="Something's gone wrong" />,
        },
        generic_client_error: {
            instruction: <Localize i18n_default_text="You'll need to restart your verification on your computer" />,
            message: <Localize i18n_default_text="Something's gone wrong" />,
        },
        glare_detected: {
            instruction: <Localize i18n_default_text='All details should be clear and readable' />,
            message: <Localize i18n_default_text='Glare detected' />,
        },
        interrupted_flow_error: {
            instruction: <Localize i18n_default_text='Restart process on a different device' />,
            message: <Localize i18n_default_text='Camera not detected' />,
        },
        invalid_capture: {
            instruction: <Localize i18n_default_text='Make sure all of the document is in the photo' />,
            message: <Localize i18n_default_text='No document detected' />,
        },
        invalid_number: {
            message: <Localize i18n_default_text='Check that your number is correct' />,
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
        liveness_timeout: {
            instruction: (
                <Localize i18n_default_text="Remember to press stop when you're done. <fallback>Redo video actions</fallback>" />
            ),
            message: <Localize i18n_default_text='Looks like you took too long' />,
        },
        multiple_faces: {
            instruction: <Localize i18n_default_text='Only your face can be in the selfie' />,
            message: <Localize i18n_default_text='Multiple faces found' />,
        },
        no_face: {
            instruction: <Localize i18n_default_text='Your face is needed in the selfie' />,
            message: <Localize i18n_default_text='No face found' />,
        },
        server_error: {
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
        unsupported_android_browser: {
            instruction: <Localize i18n_default_text='Restart the process on the latest version of Google Chrome' />,
            message: <Localize i18n_default_text='Unsupported browser' />,
        },
        unsupported_file: {
            instruction: <Localize i18n_default_text='Try using a JPG or PNG file' />,
            message: <Localize i18n_default_text='File type not supported' />,
        },
        unsupported_ios_browser: {
            instruction: <Localize i18n_default_text='Restart the process on the latest version of Safari' />,
            message: <Localize i18n_default_text='Unsupported browser' />,
        },
    },
    government_letter: <Localize i18n_default_text='Government Letter' />,
    image_quality_guide: {
        all_good: {
            image_alt_text: <Localize i18n_default_text='Document example' />,
            label: <Localize i18n_default_text='This is good' />,
        },
        next_step: <Localize i18n_default_text='Upload photo' />,
        no_blur: {
            image_alt_text: <Localize i18n_default_text='Example of a blurry document' />,
            label: <Localize i18n_default_text='All details must be clear' />,
        },
        no_glare: {
            image_alt_text: <Localize i18n_default_text='Example of a document with glare' />,
            label: <Localize i18n_default_text='Move away from direct light' />,
        },
        not_cut_off: {
            image_alt_text: <Localize i18n_default_text='Example of a cut-off document' />,
            label: <Localize i18n_default_text='Show all details — including the bottom 2 lines' />,
        },
        sub_title: <Localize i18n_default_text='Scans and photocopies are not accepted' />,
        title: <Localize i18n_default_text='Upload passport photo page' />,
    },
    loading: <Localize i18n_default_text='Loading' />,
    mobilePhrases: {
        capture: {
            driving_licence: {
                back: {
                    instructions: <Localize i18n_default_text='Take a photo of the back of your license' />,
                },
                front: {
                    instructions: <Localize i18n_default_text='Take a photo of the front of your license' />,
                },
            },
            face: {
                instructions: <Localize i18n_default_text='Take a selfie showing your face' />,
            },
            national_identity_card: {
                back: {
                    instructions: <Localize i18n_default_text='Take a photo of the back of your card' />,
                },
                front: {
                    instructions: <Localize i18n_default_text='Take a photo of the front of your card' />,
                },
            },
            passport: {
                front: {
                    instructions: <Localize i18n_default_text='Take a photo of your passport photo page' />,
                },
            },
        },
        errors: {
            camera_inactive: {
                instruction: (
                    <Localize i18n_default_text='Take a photo using the <fallback>basic camera mode</fallback> instead' />
                ),
            },
            camera_not_working: {
                instruction: (
                    <Localize i18n_default_text='Take a photo using the <fallback>basic camera mode</fallback> instead' />
                ),
            },
        },
        image_quality_guide: {
            next_step: <Localize i18n_default_text='Take a photo' />,
            title: <Localize i18n_default_text='Passport photo page' />,
        },
    },
    national_identity_card: <Localize i18n_default_text='Identity Card' />,
    passport: <Localize i18n_default_text='Passport' />,
    proof_of_address: {
        guidance: {
            continue: <Localize i18n_default_text='Continue' />,
            current_address: <Localize i18n_default_text='Current address' />,
            full_name: <Localize i18n_default_text='Full name' />,
            issue_date: <Localize i18n_default_text='Issue date or summary period' />,
            logo: <Localize i18n_default_text='Logo' />,
            make_sure_it_shows: <Localize i18n_default_text='Make sure it clearly shows:' />,
        },
        intro: {
            is_recent: <Localize i18n_default_text='Is your most <strong>recent</strong> document' />,
            matches_signup: <Localize i18n_default_text='<strong>Matches</strong> the address you used on signup' />,
            requirements: <Localize i18n_default_text="You'll need a document that:" />,
            shows_address: <Localize i18n_default_text='Shows your <strong>current</strong> address' />,
            start: <Localize i18n_default_text='Start verification' />,
            title: <Localize i18n_default_text="Let's verify your %{country} address" />,
        },
    },
    short_driving_licence: <Localize i18n_default_text='license' />,
    short_national_identity_card: <Localize i18n_default_text='card' />,
    short_passport: <Localize i18n_default_text='passport' />,
    SMS_BODY: <Localize i18n_default_text='Continue your identity verification by tapping' />,
    utility_bill: <Localize i18n_default_text='Utility Bill' />,
    webcam_permissions: {
        access_denied: <Localize i18n_default_text='Camera access is denied' />,
        allow: <Localize i18n_default_text='Allow' />,
        allow_access: <Localize i18n_default_text='Allow camera access' />,
        click_allow: <Localize i18n_default_text='We cannot verify you without using your camera' />,
        enable_webcam: <Localize i18n_default_text='Enable camera' />,
        enable_webcam_for_selfie: (
            <Localize i18n_default_text='When prompted, you must enable camera access to continue' />
        ),
        follow_steps: <Localize i18n_default_text='Follow these steps to recover camera access:' />,
        grant_access: <Localize i18n_default_text='Grant access to your camera from your browser settings' />,
        if_denied: (
            <Localize i18n_default_text="If you deny camera access, you won't be able to take pictures and complete verification process." />
        ),
        recover_access: <Localize i18n_default_text='Recover camera access to continue face verification' />,
        recovery: <Localize i18n_default_text='Recovery' />,
        refresh: <Localize i18n_default_text='Refresh' />,
        refresh_page: <Localize i18n_default_text='Refresh this page to restart the identity verification process' />,
        why: <Localize i18n_default_text='Why do I need to do this?' />,
    },
    welcome: {
        description_p_1: <Localize i18n_default_text='To open a bank account, we will need to verify your identity.' />,
        description_p_2: <Localize i18n_default_text='It will only take a couple of minutes.' />,
        next_button: <Localize i18n_default_text='Verify Identity' />,
        title: <Localize i18n_default_text='Open your new bank account' />,
    },
};

export default onfido_phrases;
