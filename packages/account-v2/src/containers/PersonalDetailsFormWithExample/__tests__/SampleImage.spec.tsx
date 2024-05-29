import React from 'react';
import { render, screen } from '@testing-library/react';
import { SampleImage } from '../SampleImage';

describe('SampleImage', () => {
    it('should render DerivLightNameDobPoiIcon if errorStatus is not provided', () => {
        render(<SampleImage />);
        expect(screen.getByTestId('dt_poi_name_dob')).toBeInTheDocument();
    });

    it('should render DerivLightNamePoiIcon if errorStatus is nameMismatch', () => {
        render(<SampleImage errorStatus='NameMismatch' />);
        expect(screen.getByTestId('dt_poi_name')).toBeInTheDocument();
    });

    it('should render DerivLightDobPoiIcon if errorStatus is dobMismatch', () => {
        render(<SampleImage errorStatus='DobMismatch' />);
        expect(screen.getByTestId('dt_poi_dob')).toBeInTheDocument();
    });

    it('should render DerivLightNameDobPoiIcon if errorStatus is name and dob mismatch', () => {
        render(<SampleImage errorStatus='NameDobMismatch' />);
        expect(screen.getByTestId('dt_poi_name_dob')).toBeInTheDocument();
    });
});
