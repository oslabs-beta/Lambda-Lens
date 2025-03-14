import ConfigForm from "./ConfigForm/ConfigForm";
import "./Config.css";

export type Config = {
  awsAccessKeyID: string;
  awsSecretAccessKey: string;
  awsRegion: string;
  mongoURI: string;
};

function ConfigPageContainer() {
  const handleSaveConfig = async (config: Required<Config>) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/config/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(config),
        }
      );
      if (response.ok) {
        alert(`Configuration saved`);
      } else {
        alert("Error saving user information");
      }
    } catch (err) {
      console.log("The following error occurred:", err);
    }
  };

  const handleSaveDatabase = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/config/db`,
        {
          method: "POST",
        }
      );
      const data = await response.json();

      if (response.ok) {
        window.location.replace(
          `${import.meta.env.VITE_API_URL.replace("8080", "3000")}/dash`
        );
      } else {
        alert(
          data.message?.err ||
            "Error connecting to database. Please check for valid URI input"
        );
      }
    } catch (err) {
      console.error("Error in handleDatabase: ", err);
      alert(
        "Failed to connect to database. Please check your connection and try again."
      );
    }
  };

  return (
    <div className="config-page-container">
      <h2>Configuration</h2>
      <div className="config-component">
        <ConfigForm onSave={handleSaveConfig} onDatabase={handleSaveDatabase} />
      </div>
    </div>
  );
}

export default ConfigPageContainer;
