import { useState } from 'react';
import './ConfigPageComponent.scss';
import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form'; //add ALL of them here

//typing form values
type Config = {
  awsAccessKeyID: string;
  awsSecretAccessKey: string;
  awsRegion: string;
  mongoURI: string;
}

type ConfigFormProps = {
  onSave: (config: Config) => void;
}

function ConfigForm({ onSave }: ConfigFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Config>();
  //problem here: 
  const onSubmit: SubmitHandler<Config> = data => {
    onSave(data);
  }

  const [config, setConfig] = useState<Config>({
    awsAccessKeyID: '',
    awsSecretAccessKey: '',
    awsRegion: '',
    mongoURI: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      [name as string]: value,
    }));
  };

  const handleSubmit1 = (e: React.FormEvent) => {
    e.preventDefault();
    //switch here 
    onSave(config);
  }

  
  return (
    <form className='config-form' onSubmit={handleSubmit(onSubmit)}>
      
      <input 
      {...register("awsAccessKeyID", { required: true })}
      placeholder='AWS Access Key'
      onChange={handleChange} 
      />
      {errors.awsAccessKeyID && <p>AWS Access Key ID is required</p>}

      <input 
      {...register("awsSecretAccessKey", { required: true })}
      placeholder='AWS Secret Access Key' 
      onChange={handleChange} 
      />
      {errors.awsSecretAccessKey && <p>AWS Secret Access Key is required</p>}

      <select {...register("awsRegion", { required: true })} onChange={handleChange} >
        <option value="">Select Region</option>
        <option value="us-east-1">US East 1</option>
        <option value="us-east-2">US East 2</option>
        <option value="us-west-1">US West 1</option>
      </select>
      {errors.awsRegion && <p>AWS Region is required</p>}
      
      <input 
      {...register("mongoURI", { required: true })}
      placeholder='MongoDB URI' 
      onChange={handleChange} 
      />
      {errors.mongoURI && <p>MongoDB URI is required</p>}

      <input type="submit"/>
    </form>
  )
}

export default ConfigForm;

