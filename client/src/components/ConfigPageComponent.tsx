import { useState } from 'react';
import './ConfigPageComponent.scss';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
  }

  return (
    <form className='config-form' onSubmit={handleSubmit}>
      <input 
        type="password" 
        placeholder='AWS Access Key' 
        name='awsAccessKeyID' 
        value={config.awsAccessKeyID} 
        onChange={handleChange} 
      />
      <input 
        type="password" 
        placeholder='AWS Secret Access Key' 
        name='awsSecretAccessKey' 
        value={config.awsSecretAccessKey} 
        onChange={handleChange} 
      />
      <select 
        name='awsRegion'
        value={config.awsRegion}
        onChange={handleChange}
      >
        <option value="">Select Region</option>
        <option value="us-east-1">US East 1</option>
        <option value="us-east-2">US East 2</option>
        <option value="us-west-1">US West 1</option>
      </select>
      <input 
        type="password" 
        placeholder='MongoDB URI' 
        name='mongoURI' 
        value={config.mongoURI} 
        onChange={handleChange} 
      />
      <button type='submit'>Save</button>
    </form>
  )
}

export default ConfigForm;