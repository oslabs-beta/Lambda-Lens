import { useState } from 'react';
import './ConfigPageComponent.scss';
import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type Config = {
  awsAccessKeyID: string;
  awsSecretAccessKey: string;
  awsRegion: string;
  mongoURI: string;
};

type ConfigFormProps = {
  onSave: (config: Config) => void;
};

function ConfigForm({ onSave }: ConfigFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Config>();
  //problem here:
  const onSubmit: SubmitHandler<Config> = (data) => {
    onSave(data);
  };

  return (
    <form className='config-form' onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('awsAccessKeyID', { required: true })}
        placeholder='AWS Access Key'
      />
      {errors.awsAccessKeyID && (
        <p className='config-error'>AWS Access Key ID is required</p>
      )}

      <input
        {...register('awsSecretAccessKey', { required: true })}
        placeholder='AWS Secret Access Key'
      />
      {errors.awsSecretAccessKey && (
        <p className='config-error'>AWS Secret Access Key is required</p>
      )}

      <select {...register('awsRegion', { required: true })}>
        <option value=''>Select Region</option>
        <option value='us-east-1'>US East 1</option>
        <option value='us-east-2'>US East 2</option>
        <option value='us-west-1'>US West 1</option>
      </select>
      {errors.awsRegion && (
        <p className='config-error'>AWS Region is required</p>
      )}

      <input
        {...register('mongoURI', { required: true })}
        placeholder='MongoDB URI'
      />
      {errors.mongoURI && (
        <p className='config-error'>MongoDB URI is required</p>
      )}

      <input type='submit' className='config-submit-button' />
    </form>
  );
}

export default ConfigForm;
