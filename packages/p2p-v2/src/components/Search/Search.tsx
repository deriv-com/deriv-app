import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import SearchIcon from '../../public/ic-search.svg';
import { Input } from '../Input';
import './Search.scss';

type TSearchProps = {
    name: string;
    placeholder: string;
}

const Search = ({ name, placeholder }: TSearchProps) => {
    const { control, formState: { errors }, getValues, handleSubmit, register } = useForm({ defaultValues: { [name]: '' }, mode: 'onChange' });
    return (
            <FormProvider {...{ control, errors, register }}>
                <form className='p2p-v2-search'>
                    <Input name={name} placeholder={placeholder} leadingIcon={<SearchIcon />}/>
                </form>
            </FormProvider>
    )
}

export default Search;
