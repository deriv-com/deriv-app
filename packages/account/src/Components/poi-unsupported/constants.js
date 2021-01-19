import { localize } from '@deriv/translations';

export const step_selfie = {
    documentType: 'national_identity_card',
    pageType: 'photo',
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
                documentType: 'passport',
                pageType: 'front',
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
                documentType: 'driving_licence',
                pageType: 'front',
                icon: 'IcDrivingLicenceFront',
                title: localize('Upload the front of your driving licence'),
                description: localize('You’ll be asked to upload the back of your driving licence next.'),
                confirmDescription: localize(
                    'After confirming, you’ll be asked to upload the back of your driving licence next.'
                ),
            },
            {
                documentType: 'driving_licence',
                pageType: 'back',
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
                documentType: 'national_identity_card',
                pageType: 'front',
                icon: 'IcIdCardFront',
                title: localize('Upload the front of your identity card'),
                description: localize('You’ll be asked to upload the back of your identity card next.'),
                confirmDescription: localize(
                    'After confirming, you’ll be asked to upload the back of your identity card next.'
                ),
            },
            {
                documentType: 'national_identity_card',
                pageType: 'back',
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
                          documentType: 'national_identity_card',
                          pageType: 'front',
                          icon: 'IcPoiNimcSlipHorizontal',
                          title: localize('Upload your NIMC slip'),
                          description: localize('You’ll be asked to upload your age declaration document next.'),
                          confirmDescription: localize(
                              'After confirming, you’ll be asked to upload your age declaration document next.'
                          ),
                      },
                      {
                          documentType: 'other',
                          pageType: 'front',
                          icon: 'IcDop',
                          title: localize('Upload your age declaration document'),
                      },
                      step_selfie,
                  ],
              },
          ]
        : []),
];
