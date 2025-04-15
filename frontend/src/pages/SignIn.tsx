import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useAuth } from '../stores/auth';
import { isValidEmailDomain } from '../utils/emailValidation';

const signInSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .refine((email) => isValidEmailDomain(email), {
      message: 'Domínio de email não permitido. Use um email válido (Gmail, Hotmail, Outlook, Yahoo ou iCloud)',
    }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  mfaCode: z.string().optional(),
});

type SignInData = z.infer<typeof signInSchema>;

export function SignIn() {
  const navigate = useNavigate();
  const { signIn, isLoading } = useAuth();
  const [showMfa, setShowMfa] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInData) => {
    try {
      const user = await signIn(data.email, data.password, data.mfaCode);
      if (user) {
        toast.success('Login realizado com sucesso');
        // Todos os usuários vão para o dashboard
        navigate('/dashboard', { replace: true });
      }
    } catch (error: unknown) {
      if (error instanceof Error && (error as { response?: { status: number } }).response?.status === 403) {
        setShowMfa(true);
        toast.error('Por favor, insira seu código MFA');
      } else {
        toast.error('Email ou senha inválidos');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Entre na sua conta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                {...register('email')}
                type="email"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                {...register('password')}
                type="password"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          {showMfa && (
            <div>
              <label htmlFor="mfaCode" className="block text-sm font-medium text-gray-700">
                MFA Code
              </label>
              <div className="mt-1">
                <input
                  {...register('mfaCode')}
                  type="text"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.mfaCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.mfaCode.message}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/reset-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link to="/sign-up" className="font-medium text-indigo-600 hover:text-indigo-500">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}