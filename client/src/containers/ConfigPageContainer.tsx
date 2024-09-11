import ConfigForm from '../components/ConfigPageComponent';
import './ConfigPageContainer.scss';

type Config = {
  awsAccessKeyID: string;
  awsSecretAccessKey: string;
  awsRegion: string;
  mongoURI: string;
};

function ConfigPageContainer() {
  const handleSaveConfig = (config: Required<Config>) => {
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
        } else {
          alert('Error saving user information');
        }
      })
      .catch((err) => {
        console.log('The following error occurred:', err);
      });
  };

  const handleSaveDatabase = () => {
    fetch('http://localhost:8080/api/config/db', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.ok) {
          window.location.replace('http://localhost:3000/dash');
        } else {
          alert(
            'Error connecting to database. Please check for valid URI input'
          );
        }
      })
      .catch((err) => {
        console.log('Error in handleDatabase: ', err);
      });
  };
  return (
    <div className='config-page-container'>
      <h2>Configuration</h2>
      <div className='config-component'>
        <ConfigForm onSave={handleSaveConfig} onDatabase={handleSaveDatabase} />
      </div>
    </div>
  );
}

export default ConfigPageContainer;
