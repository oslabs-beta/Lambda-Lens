import ConfigForm from "./ConfigForm/ConfigForm";
import { useAuth } from "../../context/AuthContext";
import { RefreshIcon } from "../../components/icons"; 

export type Config = {
  awsAccessKeyID: string;
  awsSecretAccessKey: string;
  awsRegion: string;
};

function ConfigPageContainer() {
  const { currentUser } = useAuth(); 

  const handleSaveConfig = async (config: Config) => {
    if (!currentUser) {
      alert("Please log in to save configuration.");
      return;
    }
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/config/save`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message?.err || errorData.message || "Failed to save configuration";
        throw new Error(errorMessage);
      }

      alert("Configuration saved successfully!");
    } catch (err) {
      console.error("Error saving configuration:", err);
      alert(`An error occurred while saving configuration: ${err instanceof Error ? err.message : 'Please try again.'}`);
    }
  };

  const handleTestConnection = () => {
    alert("Test Connection feature not yet implemented.");
  };

  return (
    <div className="p-6 bg-light-cont-l dark:bg-dark-cont-l transition-colors min-h-screen">
      <div className="pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-dark-text-prim">
            Configuration
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-dark-text-sec">
            Enter your AWS credentials to start monitoring your Lambda functions.
          </p>
        </div>
        <button
          onClick={handleTestConnection}
          className="flex items-center justify-center h-9 px-4 bg-white dark:bg-dark-cont-s border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-cont-m text-gray-700 dark:text-gray-300 rounded-md transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-dark-bg"
        >
          <RefreshIcon className="w-4 h-4 mr-2" /> 
          Test Connection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-cont-m p-6 rounded-lg border border-gray-200 dark:border-gray-700">
           <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-dark-text-prim">AWS Credentials</h2>
           <p className="text-sm text-gray-500 dark:text-dark-text-sec mb-4">
             Your credentials are securely stored and used only to access your Lambda metrics.
           </p>
          <ConfigForm onSave={handleSaveConfig} />
        </div>

        <div className="bg-white dark:bg-dark-cont-m p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-dark-text-prim">Security Information</h2>
          <p className="text-sm text-gray-500 dark:text-dark-text-sec mb-4">
            How we handle your AWS credentials
          </p>
          <div className="space-y-4 text-sm text-gray-700 dark:text-dark-text-sec">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-dark-text-prim mb-1">Credential Storage</h3>
              <p>Your AWS credentials are encrypted server-side before being stored. They are only used to fetch metrics from your AWS account via the official AWS SDK.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-dark-text-prim mb-1">Recommended Permissions</h3>
              <p>We strongly recommend creating a dedicated IAM user with read-only access specifically for LambdaLens. Attach policies that grant only necessary permissions, such as `AWSLambda_ReadOnlyAccess` and `CloudWatchReadOnlyAccess`.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-dark-text-prim mb-1">Best Practices</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Use an IAM user with the principle of least privilege.</li>
                <li>Enable Multi-Factor Authentication (MFA) for your AWS root account and IAM users.</li>
                <li>Rotate your access keys regularly according to your security policy.</li>
                <li>Monitor your AWS account for suspicious activity using services like AWS CloudTrail.</li>
              </ul>
            </div>
            <a href="https://aws.amazon.com/architecture/security-identity-compliance/?cards-all.sort-by=item.additionalFields.sortDate&cards-all.sort-order=desc&awsf.content-type=*all&awsf.methodology=*all" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
              Learn more about AWS security best practices
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfigPageContainer;
