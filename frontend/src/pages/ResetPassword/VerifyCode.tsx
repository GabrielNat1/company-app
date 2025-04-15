import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { KeyRound } from 'lucide-react';
import { api } from '../../lib/axios';

const verifyCodeSchema = z.object({
  code: z.string().min(6, 'Código deve ter 6 caracteres'),
});

type VerifyCodeData = z.infer<typeof verifyCodeSchema>;

export function VerifyCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<VerifyCodeData>({
    resolver: zodResolver(verifyCodeSchema),
  });

  const onSubmit = async (data: VerifyCodeData) => {
    try {
      await api.post('/auth/reset-password/verify', {
        email,
        code: data.code,
      });
      navigate(`/reset-password/new?email=${email}&code=${data.code}`);
    } catch {
      toast.error('Código inválido');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <KeyRound className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verificar código
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Digite o código enviado para seu email
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Código
              </label>
              <div className="mt-1">
                <input
                  {...register('code')}
                  type="text"
                  maxLength={6}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Verificando...' : 'Verificar código'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
