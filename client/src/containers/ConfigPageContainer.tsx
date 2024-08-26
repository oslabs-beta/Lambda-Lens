import ConfigForm from "../components/ConfigPageComponent";
import './ConfigPageContainer.scss';

type Config = {
  awsAccessKeyID: string;
  awsSecretAccessKey: string;
  awsRegion: string;
  mongoURI: string;
}

function ConfigPageContainer() {
  const handleSaveConfig = (config: Config) => {
    console.log('Sending config', config);
    fetch('http://localhost:8080/api/config/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    })
    .then((res) => {
      if (res.ok) {
        alert('Configuration saved')
      } else {
        alert('Configuration not saved')
      }
    })
    .catch((err) => {
      console.log('The following error occurred:', err)
    })
  };

  return (
    <div className="config-page-container">
      <h2>Configuration</h2>
      <ConfigForm onSave={handleSaveConfig} />
    </div>
  );
}

export default ConfigPageContainer;