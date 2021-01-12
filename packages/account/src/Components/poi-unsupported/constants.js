import React from 'react';
import { localize } from '@deriv/translations';
import { DetailComponent } from './detail-component.jsx';
import Passport from './passport.jsx';
import IdentityCard from './identity-card.jsx';

const root_class = 'unsupported-country-poi';

export const getDocumentIndex = ({ setDetail, residence }) => [
    {
        title: localize('Passport'),
        description: localize('Upload the page that contains your photo.'),
        icon: 'IcPoiPassport',
        steps: [
            {
                icon: 'IcPassport',
                title: localize('Upload the page of your passport that contains your photo'),
            },
        ],
        detail: (
            <DetailComponent root_class={root_class} onClickBack={() => setDetail(null)}>
                <Passport />
            </DetailComponent>
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
            <DetailComponent root_class={root_class} onClickBack={() => setDetail(null)}>
                <IdentityCard />
            </DetailComponent>
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
