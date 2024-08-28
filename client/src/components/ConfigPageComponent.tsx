import { useState } from 'react';
import './ConfigPageComponent.scss';
import * as React from 'react';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import InputLabel from '@mui/material/InputLabel';
// import FormControl from '@mui/material/FormControl';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import FormHelperText from '@mui/material/FormHelperText';


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
    //switch here 
    onSave(config);
  }



  return (
    <form className='config-form' onSubmit={handleSubmit}>
      {/* <TextField
          error
          id="outlined-error"
          label="AWS Access Key ID Required"
          // defaultValue="Hello World"
          placeholder='minimum 16 characters'
          type='password'
          onChange={handleChange}
        /> */}
      <input 
        type="password" 
        placeholder='AWS Access Key' 
        name='awsAccessKeyID' 
        value={config.awsAccessKeyID} 
        onChange={handleChange} 
      />
      {/* <TextField
          error
          id="outlined-error"
          label="AWS Secret Access Key Required"
          // defaultValue="Hello World"
          placeholder='case sensitive'
          type='password'
          onChange={handleChange}
        /> */}
      <input 
        type="password" 
        placeholder='AWS Secret Access Key' 
        name='awsSecretAccessKey' 
        value={config.awsSecretAccessKey} 
        onChange={handleChange} 
      />
      {/* <FormControl sx={{ m: 1, minWidth: 120 }} error>
        <InputLabel>AWS Region</InputLabel>
        <Select
          value={config.awsRegion}
          placeholder="Region"
          onChange={handleChange}
          renderValue={(value) => `⚠️  - ${value}`}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="us-east-1" onChange={handleChange} >US East 1</MenuItem>
          <MenuItem value="us-east-2" onChange={handleChange}>US East 2</MenuItem>
          <MenuItem value="us-west-1" onChange={handleChange}>US West 1</MenuItem>
        </Select>
        <FormHelperText>Required</FormHelperText>
      </FormControl> */}

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

      {/* <TextField
          error
          id="outlined-error"
          label="MongoDB URI Required"
          // defaultValue="Hello World"
          placeholder='personal URL with username and password'
          type='password'
          onChange={handleChange}
        /> */}

      <input 
        type="password" 
        placeholder='MongoDB URI' 
        name='mongoURI' 
        value={config.mongoURI} 
        onChange={handleChange} 
      />
      <button type='submit' onSubmit={handleSubmit}>Save</button>
    </form>
  )
}

export default ConfigForm;

