import ConfigForm from "../components/ConfigPageComponent";
import './ConfigPageContainer.scss';

type Config = {
  awsAccessKeyID: string;
  awsSecretAccessKey: string;
  awsRegion: string;
  mongoURI: string;
}

function ConfigPageContainer() {

  const handleSaveConfig = (config: Required<Config>) => {
    // console.log('Sending config', config);
    fetch('http://localhost:8080/api/config/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    })
    .then((res) => {
      if (res.ok) {
        alert(`Configuration saved`);
        // window.location.replace("http://localhost:3000");
      } else {
        alert('Error: Configuration not saved \nMissing one or more fields');
      }
    })
    .catch((err) => {
      console.log('The following error occurred:', err);
    })
  };

  const handleSaveDatabase = () => {
    fetch('http://localhost:8080/api/config/db', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      if(res.ok) {
        window.location.replace("http://localhost:3000");
      } else { 
        alert('Error connecting to database. Please check for valid URI input');
      }
    })
    .catch((err) => {
      console.log('Error in handleDatabase: ', err);
    })
  }
  return (
    <div className="config-page-container">
      <h2>Configuration</h2>
      <ConfigForm onSave={handleSaveConfig} onDatabase={handleSaveDatabase}/>
    </div>
  );
}

export default ConfigPageContainer;