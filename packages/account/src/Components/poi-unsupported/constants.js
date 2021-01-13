import { localize } from '@deriv/translations';

export const step_selfie = {
    document_type: 'selfie',
    page_type: 'photo',
    icon: 'IcSelfie',
    title: localize('Upload your selfie'),
    description: localize(
        'Face forward and remove your glasses if necessary. Make sure your eyes are clearly visible and your face is within the frame.'
    ),
};

export const getDocumentIndex = ({ residence }) => [
    {
        title: localize('Passport'),
        description: localize('Upload the page that contains your photo.'),
        icon: 'IcPoiPassport',
        steps: [
            {
                document_type: 'passport',
                page_type: 'front',
                icon: 'IcPassport',
                title: localize('Upload the page of your passport that contains your photo'),
            },
            step_selfie,
        ],
    },
    {
        title: localize('Driving licence'),
        description: localize('Upload the front and back of your driving licence.'),
        icon: 'IcPoiDrivingLicence',
        steps: [
            {
                document_type: 'driving_licence',
                page_type: 'front',
                icon: 'IcDrivingLicenceFront',
                title: localize('Upload the front of your driving licence'),
                description: localize('You’ll be asked to upload the back of your driving licence next.'),
                confirm_description: localize(
                    'After confirming, you’ll be asked to upload the back of your driving licence next.'
                ),
            },
            {
                document_type: 'driving_licence',
                page_type: 'back',
                icon: 'IcIdCardBack',
                title: localize('Upload the back of your driving licence'),
            },
            step_selfie,
        ],
    },
    {
        title: localize('Identity card'),
        description: localize('Upload the front and back of your identity card.'),
        icon: 'IcPoiIdentityCard',
        steps: [
            {
                document_type: 'national_identity_card',
                page_type: 'front',
                icon: 'IcIdCardFront',
                title: localize('Upload the front of your identity card'),
                description: localize('You’ll be asked to upload the back of your identity card next.'),
                confirm_description: localize(
                    'After confirming, you’ll be asked to upload the back of your identity card next.'
                ),
            },
            {
                document_type: 'national_identity_card',
                page_type: 'back',
                icon: 'IcIdCardBack',
                title: localize('Upload the back of your identity card'),
            },
            step_selfie,
        ],
    },
    ...(residence === 'ng'
        ? [
              {
                  title: localize('NIMC slip and an age declaration document'),
                  description: localize('Upload both of these documents to prove your identity.'),
                  icon: 'IcPoiNimcSlip',
                  steps: [
                      {
                          document_type: 'nimc',
                          page_type: 'front',
                          icon: 'IcPoiNimcSlipHorizontal',
                          title: localize('Upload your NIMC slip'),
                          description: localize('You’ll be asked to upload your age declaration document next.'),
                          confirm_description: localize(
                              'After confirming, you’ll be asked to upload your age declaration document next.'
                          ),
                      },
                      {
                          document_type: 'dob',
                          page_type: 'front',
                          icon: 'IcDop',
                          title: localize('Upload your age declaration document'),
                      },
                      step_selfie,
                  ],
              },
          ]
        : []),
];
