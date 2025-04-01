import ConfigForm from "./ConfigForm/ConfigForm";
import { useAuth } from "../../context/AuthContext"; 

export type Config = {
  awsAccessKeyID: string;
  awsSecretAccessKey: string;
  awsRegion: string;
};

function ConfigPageContainer() {
  const { currentUser } = useAuth(); 

  const handleSaveConfig = async (config: Config) => { 
    if (!currentUser) {
      alert("You must be logged in to save configuration.");
      return;
    }

    try {
      const token = await currentUser.getIdToken(); 

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/config/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, 
          },
          body: JSON.stringify({
            awsAccessKeyID: config.awsAccessKeyID,
            awsSecretAccessKey: config.awsSecretAccessKey,
            awsRegion: config.awsRegion,
          }),
        }
      );

      const responseData = await response.json(); 

      if (response.ok) {
        alert(responseData.message || `Configuration saved successfully.`); 
      } else {
        alert(responseData.message?.err || responseData.err || "Error saving configuration");
      }
    } catch (err) {
      console.error("Error saving configuration:", err); 
      alert("An error occurred while saving configuration. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-light-cont-l dark:bg-dark-cont-l transition-colors">
      <div className="border-b border-light-cont-s dark:border-dark-cont-s pb-5 mb-6">
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-light-text-prim dark:text-dark-text-prim">
              Configuration
            </h1>
            <p className="mt-1 text-sm text-light-text-sec dark:text-dark-text-sec">
              Enter your AWS credentials to start monitoring your Lambda functions.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <ConfigForm onSave={handleSaveConfig} />
      </div>
    </div>
  );
}

export default ConfigPageContainer;
