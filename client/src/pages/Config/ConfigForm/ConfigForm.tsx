import { useForm, SubmitHandler } from "react-hook-form";

type Config = {
  awsAccessKeyID: string;
  awsSecretAccessKey: string;
  awsRegion: string;
};

type ConfigFormProps = {
  onSave: (config: Config) => void;
};

function ConfigForm({ onSave }: ConfigFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Config>();
  const onSubmit: SubmitHandler<Config> = (data) => {
    onSave(data);
  };

  const inputClasses = "block w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-cont-s text-gray-900 dark:text-dark-text-prim placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:opacity-50 transition-colors text-sm";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-dark-text-sec mb-1";
  const errorClasses = "text-xs text-red-600 dark:text-red-400 mt-1";
  const buttonClasses = "w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md border-0 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-dark-cont-m disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm";


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col font-sans space-y-4">
        <div>
          <label htmlFor="awsAccessKeyID" className={labelClasses}>AWS Access Key ID</label>
          <input
            id="awsAccessKeyID"
            {...register("awsAccessKeyID", { required: "AWS Access Key ID is required" })}
            placeholder="AKIAIOSFODNN7EXAMPLE" 
            className={inputClasses}
          />
          {errors.awsAccessKeyID && (
            <p className={errorClasses}>{errors.awsAccessKeyID.message}</p>
          )}
        </div>

        <div>
           <label htmlFor="awsSecretAccessKey" className={labelClasses}>AWS Secret Access Key</label>
          <input
            id="awsSecretAccessKey"
            type="password"
            {...register("awsSecretAccessKey", { required: "AWS Secret Access Key is required" })}
            placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" 
            className={inputClasses}
          />
          {errors.awsSecretAccessKey && (
            <p className={errorClasses}>{errors.awsSecretAccessKey.message}</p>
          )}
        </div>

        <div>
           <label htmlFor="awsRegion" className={labelClasses}>AWS Region</label>
          <select
            id="awsRegion"
            {...register("awsRegion", { required: "AWS Region is required" })}
            className={`${inputClasses} appearance-none`} 
            defaultValue=""
          >
            <option value="" disabled>Select AWS Region</option>
            <option value="us-east-1">US East 1 (N. Virginia)</option>
            <option value="us-east-2">US East 2 (Ohio)</option>
            <option value="us-west-1">US West 1 (N. California)</option>
            <option value="us-west-2">US West 2 (Oregon)</option>
            <option value="ap-south-1">AP South 1 (Mumbai)</option>
            <option value="ap-northeast-3">AP Northeast 3 (Osaka)</option>
            <option value="ap-northeast-2">AP Northeast 2 (Seoul)</option>
            <option value="ap-southeast-1">AP Southeast 1 (Singapore)</option>
            <option value="ap-southeast-2">AP Southeast 2 (Sydney)</option>
            <option value="ap-northeast-1">AP Northeast 1 (Tokyo)</option>
            <option value="ca-central-1">CA Central 1 (Canada)</option>
            <option value="eu-central-1">EU Central 1 (Frankfurt)</option>
            <option value="eu-west-1">EU West 1 (Ireland)</option>
            <option value="eu-west-2">EU West 2 (London)</option>
            <option value="eu-west-3">EU West 3 (Paris)</option>
            <option value="eu-north-1">EU North 1 (Stockholm)</option>
            <option value="sa-east-1">SA East 1 (São Paulo)</option>
            <option value="af-south-1">AF South 1 (Cape Town)</option>
            <option value="ap-east-1">AP East 1 (Hong Kong)</option>
            <option value="ap-south-2">AP South 2 (Hyderabad)</option>
            <option value="ap-southeast-3">AP Southeast 3 (Jakarta)</option>
            <option value="ap-southeast-4">AP Southeast 4 (Melbourne)</option>
            <option value="ca-west-1">CA West 1 (Calgary)</option>
            <option value="eu-south-1">EU South 1 (Milan)</option>
            <option value="eu-south-2">EU South 2 (Spain)</option>
            <option value="eu-central-2">EU Central 2 (Zurich)</option>
            <option value="me-south-1">ME South 1 (Bahrain)</option>
            <option value="me-central-1">ME Central 1 (UAE)</option>
            <option value="il-central-1">IL Central 1 (Tel Aviv)</option>
          </select>
          {errors.awsRegion && (
            <p className={errorClasses}>{errors.awsRegion.message}</p>
          )}
        </div>

      <div className="pt-2"> 
        <input
          type="submit"
          value="Save Configuration"
          className={buttonClasses}
        />
      </div>
    </form>
  );
}

export default ConfigForm;
