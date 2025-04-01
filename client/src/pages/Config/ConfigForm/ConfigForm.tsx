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

  const inputClasses = "p-2 rounded-lg bg-[#e1e1e1] hover:bg-[#f3f3f3] dark:bg-[#363636] dark:hover:bg-[#404040] text-[#161616] dark:text-[#a2a2a2] outline-none border-0 focus:ring-2 focus:ring-[#447A90] dark:focus:ring-[#62ACCC] disabled:opacity-50 transition-colors";
  const errorClasses = "text-left text-red-500 text-xs pl-2.5 relative before:content-['⚠_'] before:inline-block before:text-red-500 before:mr-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-[700px] max-w-full bg-[#f3f3f3] dark:bg-[#2a2a2a] p-6 rounded-lg shadow-md font-sans">
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <input
            {...register("awsAccessKeyID", { required: true })}
            placeholder="AWS Access Key ID"
            className={inputClasses}
          />
          {errors.awsAccessKeyID && (
            <p className={errorClasses}>AWS Access Key ID is required</p>
          )}
        </div>

        {/* AWS Secret Access Key Input */}
        <div className="flex flex-col gap-1.5">
          <input
            type="password" 
            {...register("awsSecretAccessKey", { required: true })}
            placeholder="AWS Secret Access Key"
            className={inputClasses}
          />
          {errors.awsSecretAccessKey && (
            <p className={errorClasses}>AWS Secret Access Key is required</p>
          )}
        </div>

        {/* AWS Region Select */}
        <div className="flex flex-col gap-1.5">
          <select
            {...register("awsRegion", { required: true })}
            className={inputClasses}
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
            <p className={errorClasses}>AWS Region is required</p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <input
          type="submit"
          value="Save Configuration" 
          className="w-full px-4 py-2 bg-[#447A90] hover:bg-[#62ACCC] text-white rounded-lg border-0 outline-none focus:ring-2 focus:ring-[#447A90] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        />
      </div>
    </form>
  );
}

export default ConfigForm;
