import ConfigForm from "./ConfigForm/ConfigForm";

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
        window.location.href = "/dash";
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
    <div className="p-6 bg-light-cont-l dark:bg-dark-cont-l transition-colors">
      <h2 className="text-4xl font-normal mb-5 text-light-text-prim dark:text-dark-text-prim">Configuration</h2>
      <div className="flex flex-col items-center">
        <ConfigForm onSave={handleSaveConfig} onDatabase={handleSaveDatabase} />
      </div>
    </div>
  );
}

export default ConfigPageContainer;
