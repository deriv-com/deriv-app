import React from 'react';
import IcPOALock from '../../../../assets/verification-status/ic-poa-lock.svg';
import POAStatus from '../POAStatus';

type TPOAError = {
    error_message: string;
};

const POAError = ({ error_message }: TPOAError) => <POAStatus icon={<IcPOALock width={128} />} title={error_message} />;

export default POAError;
