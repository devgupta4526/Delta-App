import  { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Theme } from '../theme/index.ts'; // Adjust path as needed

const step1Schema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
});

type Step1Data = z.infer<typeof step1Schema>;

const RegisterScreen = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  });

  const handleNext = (data: Step1Data) => {
    setFormData({ ...formData, ...data });
    setStep(2); // next step
  };

  const {
    colors: {
      background,
      backgroundDark,
      surface,
      surfaceDark,
      textPrimary,
      textSecondary,
      textSecondaryDark,
      primary,
      border,
      danger,
    },
    typography,
  } = Theme;

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 bg-[${background}] dark:bg-[${backgroundDark}]`}>
      <div
        className={`max-w-md w-full p-8 rounded-2xl border shadow-xl 
                    bg-[${surface}] text-[${textPrimary}] border-[${border}]
                    dark:bg-[${surfaceDark}] dark:text-white dark:border-gray-700`}
        style={{ fontFamily: typography.fontFamily }}
      >
        <div className="mb-6 text-center">
          <h2 className={`text-2xl font-bold text-[${textPrimary}]`}>Create Your Account</h2>
          <p className={`text-sm mt-1 text-[${textSecondary}] dark:text-[${textSecondaryDark}]`}>
            Step {step} of 4
          </p>
        </div>

        <form onSubmit={handleSubmit(handleNext)} className="space-y-5">
          <div>
            <label className={`block text-sm mb-1 text-[${textSecondary}] dark:text-[${textSecondaryDark}]`}>
              Full Name
            </label>
            <input
              type="text"
              {...register('name')}
              className={`w-full px-4 py-2 rounded-lg border bg-[${background}]
                         text-[${textPrimary}] border-[${border}] focus:outline-none focus:ring-2 focus:ring-[${primary}]
                         dark:bg-[${surfaceDark}] dark:text-white dark:border-gray-600`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className={`text-sm mt-1 text-[${danger}]`}>{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm mb-1 text-[${textSecondary}] dark:text-[${textSecondaryDark}]`}>
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className={`w-full px-4 py-2 rounded-lg border bg-[${background}]
                         text-[${textPrimary}] border-[${border}] focus:outline-none focus:ring-2 focus:ring-[${primary}]
                         dark:bg-[${surfaceDark}] dark:text-white dark:border-gray-600`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className={`text-sm mt-1 text-[${danger}]`}>{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm mb-1 text-[${textSecondary}] dark:text-[${textSecondaryDark}]`}>
              Password
            </label>
            <input
              type="password"
              {...register('password')}
              className={`w-full px-4 py-2 rounded-lg border bg-[${background}]
                         text-[${textPrimary}] border-[${border}] focus:outline-none focus:ring-2 focus:ring-[${primary}]
                         dark:bg-[${surfaceDark}] dark:text-white dark:border-gray-600`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className={`text-sm mt-1 text-[${danger}]`}>{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-lg bg-[${primary}] text-white font-semibold transition hover:opacity-90`}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterScreen;