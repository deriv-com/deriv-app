import { localize } from '@deriv/translations';

const onfido_phrases = {
    accessibility: {
        camera_view: localize('View from camera'),
        close_sdk_screen: localize('Close identity verification screen'),
        country_select: localize('Select country'),
        cross_device_verification: localize('Steps required to continue verification on your mobile'),
        dismiss_alert: localize('Dismiss alert'),
        document_types: localize('Documents you can use to verify your identity'),
        replay_video: localize('Replay your recorded video'),
        selfie_video_actions: localize('Actions to record a selfie video'),
        shutter: localize('Take a photo'),
        start_recording: localize('Start recording'),
        stop_recording: localize('Stop recording'),
    },
    back: localize('back'),
    bank_building_society_statement: localize('Bank or building society statement'),
    benefit_letters: localize('Benefits Letter'),
    cancel: localize('Cancel'),
    capture: {
        bank_building_society_statement: {
            front: {
                instructions: localize('Provide the whole document page for best results'),
                sub_title: localize('Must be issued in the <strong>last 3 months</strong>'),
                title: localize('Submit statement'),
                webcam: localize('Position your bank statement in the frame (it will be automatically detected)'),
            },
        },
        benefit_letters: {
            front: {
                instructions: localize('Provide the whole document page for best results'),
                sub_title: localize('Must be issued in the <strong>last 12 months</strong>'),
                title: localize('Submit letter'),
                webcam: localize('Position your benefits letter in the frame (it will be automatically detected)'),
            },
        },
        council_tax: {
            front: {
                instructions: localize('Provide the whole document page for best results'),
                sub_title: localize('Must be issued in the <strong>last 12 months</strong>'),
                title: localize('Submit letter'),
                webcam: localize('Position your council tax letter in the frame (it will be automatically detected)'),
            },
        },
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
        government_letter: {
            front: {
                instructions: localize('Provide the whole document page for best results'),
                sub_title: localize('Must be issued in the <strong>last 12 months</strong>'),
                title: localize('Government Letter'),
                webcam: localize('Position your government letter in the frame (it will be automatically detected)'),
            },
        },
        liveness: {
            challenges: {
                done_next: localize("When you're done, press next"),
                done_stop: localize("When you're done, press stop"),
                left: localize('left'),
                movement: localize('Look over your %{side} shoulder'),
                next: localize('Next'),
                position_face: localize('Position your face in the oval'),
                recite: localize('Say each digit out loud'),
                right: localize('right'),
            },
            intro: {
                continue: localize('Continue'),
                speak_out_loud: localize('One will involve <strong>speaking out loud</strong>'),
                title: localize("Let's make sure nobody's impersonating you"),
                two_actions: localize("We'll ask you to film yourself performing <strong>2 simple actions</strong>"),
            },
            press_record: localize('Press record and follow the instructions'),
            recording: localize('Recording'),
            start: localize('Start'),
            stop: localize('Stop'),
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
        utility_bill: {
            front: {
                instructions: localize('Provide the whole document page for best results'),
                sub_title: localize('Must be issued in the <strong>last 3 months</strong>'),
                title: localize('Submit bill'),
                webcam: localize('Position your utility bill in the frame (it will be automatically detected)'),
            },
        },
    },
    close: localize('close'),
    complete: {
        message: localize('Verification complete'),
        submessage: localize('Thank you'),
    },
    confirm: {
        bank_building_society_statement: {
            message: localize('Make sure details are clear to read, with no blur or glare'),
        },
        benefit_letters: {
            message: localize('Make sure details are clear to read, with no blur or glare'),
        },
        confirm: localize('Confirm'),
        continue: localize('Continue'),
        council_tax: {
            message: localize('Make sure details are clear to read, with no blur or glare'),
        },
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
            video: {
                title: localize('Check selfie video'),
            },
        },
        national_identity_card: {
            message: localize('Make sure your card details are clear to read, with no blur or glare'),
        },
        passport: {
            message: localize('Make sure your passport details are clear to read, with no blur or glare'),
        },
        redo: localize('Redo'),
        utility_bill: {
            message: localize('Make sure details are clear to read, with no blur or glare'),
        },
    },
    continue: localize('Continue'),
    council_tax: localize('Council Tax Letter'),
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
        proof_of_address: {
            benefits_letter_hint: localize(
                'Government authorised household benefits eg. Jobseeker allowance, Housing benefit, Tax credits'
            ),
            estatements_accepted: localize('e-statements accepted'),
            government_letter_hint: localize(
                'Any government issued letter eg. Benefits entitlement, Voting letters, Tax letters, etc'
            ),
            hint: localize('These are the documents most likely to show your current home address'),
            title: localize('Select a %{country} document'),
            utility_bill_hint: localize('Gas, electricity, water, landline, or broadband'),
            utility_bill_warning: localize('Sorry, no mobile phone bills'),
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
        liveness_timeout: {
            instruction: localize("Remember to press stop when you're done. <fallback>Redo video actions</fallback>"),
            message: localize('Looks like you took too long'),
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
    government_letter: localize('Government Letter'),
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
    proof_of_address: {
        guidance: {
            continue: localize('Continue'),
            current_address: localize('Current address'),
            full_name: localize('Full name'),
            issue_date: localize('Issue date or summary period'),
            logo: localize('Logo'),
            make_sure_it_shows: localize('Make sure it clearly shows:'),
        },
        intro: {
            is_recent: localize('Is your most <strong>recent</strong> document'),
            matches_signup: localize('<strong>Matches</strong> the address you used on signup'),
            requirements: localize("You'll need a document that:"),
            shows_address: localize('Shows your <strong>current</strong> address'),
            start: localize('Start verification'),
            title: localize("Let's verify your %{country} address"),
        },
    },
    short_driving_licence: localize('license'),
    short_national_identity_card: localize('card'),
    short_passport: localize('passport'),
    SMS_BODY: localize('Continue your identity verification by tapping'),
    utility_bill: localize('Utility Bill'),
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
};

export default onfido_phrases;
