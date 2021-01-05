import React from 'react';
import { localize } from '@deriv/translations';
import { DetailComponent } from './detail-component.jsx';

const nimc_machine = {
    initial_state: 'nimc_pending',
    nimc_pending: {
        transition: {
            forward: {
                target: 'file_confirmation',
            },
        },
    },
    file_confirmation: {
        transition: {
            backward: {
                target: 'nimc_pending',
            },
            forward: {
                target: 'age_declaration',
            },
        },
    },
    age_declaration: {
        transition: {
            forward: {
                target: 'age_declaration_confirmation',
            },
            backward: {
                target: 'age_declaration',
            },
        },
    },
    age_declaration_confirmation: {
        transition: {
            forward: 'selfie_upload',
            backward: 'age_declaration',
        },
    },
    selfie_upload: {
        transition: {
            forward: 'selfie_confirmation',
        },
    },
};

export const getDocumentIndex = ({ setDetail, residence }) => [
    {
        title: localize('Passports'),
        description: localize('Upload the page that contains your photo.'),
        icon: 'IcPoiPassport',
        detail: (
            <DetailComponent
                title={localize('Upload the page of your passport that contains your photo')}
                icon='IcPassport'
                icon_back='IcIdCardBack'
                required_documents={1}
                onClickBack={() => setDetail(null)}
            />
        ),
    },
    {
        title: localize('Driving licence'),
        description: localize('Upload the front and back of your driving licence.'),
        icon: 'IcPoiDrivingLicence',
        detail: (
            <DetailComponent
                title={localize('Upload the front of your driving licence')}
                description={localize('You’ll be asked to upload the back of your driving licence next.')}
                required_documents={2}
                icon='IcDrivingLicenceFront'
                icon_back='IcIdCardBack'
                title_back='Upload the back of your driving licence'
                onClickBack={() => setDetail(null)}
            />
        ),
    },
    {
        title: localize('Identity card'),
        description: localize('Upload the front and back of your identity card.'),
        icon: 'IcPoiIdentityCard',
        detail: (
            <DetailComponent
                title={localize('Upload the front of your identity card')}
                description={localize('You’ll be asked to upload your age declaration document next.')}
                icon='IcPoiIdentityCard'
                icon_back='IcIdCardBack'
                required_documents={2}
                onClickBack={() => setDetail(null)}
            />
        ),
    },
    ...(residence === 'ng'
        ? [
              {
                  title: localize('NIMC slip and an age declaration document'),
                  description: localize('Upload both of these documents to prove your identity.'),
                  icon: 'IcPoiNimcSlip',
                  detail: (
                      <DetailComponent
                          title={localize('Upload your NIMC slip')}
                          description={localize('You’ll be asked to upload your age declaration document next.')}
                          required_documents={2}
                          icon='IcPoiNimcSlipHorizontal'
                          onClickBack={() => setDetail(null)}
                      />
                  ),
              },
          ]
        : []),
];
