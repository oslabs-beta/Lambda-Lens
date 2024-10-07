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
  onDatabase: () => void;
};

function ConfigForm({ onSave, onDatabase }: ConfigFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Config>();
  const onSubmit: SubmitHandler<Config> = (data) => {
    onSave(data);
  };

  const handleDatabase = (e: React.FormEvent) => {
    e.preventDefault();
    onDatabase();
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
        <option value='us-east-1'>US East 1 (N. Virginia)</option>
        <option value='us-east-2'>US East 2 (Ohio)</option>
        <option value='us-west-1'>US West 1 (N. California)</option>
        <option value='us-west-2'>US West 2 (Oregon)</option>
        <option value='ap-south-1'>AP South 1 (Mumbai)</option>
        <option value='ap-northeast-3'>AP Northeast 3 (Osaka)</option>
        <option value='ap-northeast-2'>AP Northeast 2 (Seoul)</option>
        <option value='ap-southeast-1'>AP Southeast 1 (Singapore)</option>
        <option value='ap-southeast-2'>AP Southeast 2 (Sydney)</option>
        <option value='ap-northeast-1'>AP Northeast 1 (Tokyo)</option>
        <option value='ca-central-1'>CA Central 1 (Canada)</option>
        <option value='eu-central-1'>EU Central 1 (Frankfurt)</option>
        <option value='eu-west-1'>EU West 1 (Ireland)</option>
        <option value='eu-west-2'>EU West 2 (London)</option>
        <option value='eu-west-3'>EU West 3 (Paris)</option>
        <option value='eu-north-1'>EU North 1 (Stockholm)</option>
        <option value='sa-east-1'>SA East 1 (São Paulo)</option>
        <option value='af-south-1'>AF South 1 (Cape Town)</option>
        <option value='ap-east-1'>AP East 1 (Hong Kong)</option>
        <option value='ap-south-2'>AP South 2 (Hyderabad)</option>
        <option value='ap-southeast-3'>AP Southeast 3 (Jakarta)</option>
        <option value='ap-southeast-4'>AP Southeast 4 (Melbourne)</option>
        <option value='ca-west-1'>CA West 1 (Calgary)</option>
        <option value='eu-south-1'>EU South 1 (Milan)</option>
        <option value='eu-south-2'>EU South 2 (Spain)</option>
        <option value='eu-central-2'>EU Central 2 (Zurich)</option>
        <option value='me-south-1'>ME South 1 (Bahrain)</option>
        <option value='me-central-1'>ME Central 1 (UAE)</option>
        <option value='il-central-1'>IL Central 1 (Tel Aviv)</option>
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
      <button type='submit' className='db-button' onClick={handleDatabase}>
        Connect to Database
      </button>
    </form>
  );
}

export default ConfigForm;
