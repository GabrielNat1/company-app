import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useAuth } from '../stores/auth';
import { User, Bell } from 'lucide-react';

const settingsSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  notifications: z.boolean(),
  darkMode: z.boolean(),
  twoFactorAuth: z.boolean(),
});

type SettingsData = z.infer<typeof settingsSchema>;

export function Settings() {
  const { user } = useAuth();
  const [isDark] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SettingsData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      notifications: true,
      darkMode: isDark,
      twoFactorAuth: false,
    }
  });

  const onSubmit = async () => {
    try {
      // API call to update settings would go here
      toast.success('Configurações atualizadas com sucesso!');
    } catch {
      toast.error('Erro ao atualizar configurações');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">Configurações</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <User className="mr-2" size={20} />
                Perfil
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Nome
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Preferences Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Bell className="mr-2" size={20} />
                Preferências
              </h2>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Notificações
                </label>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('notifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Modo Escuro
                </label>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('darkMode')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Autenticação em 2 Fatores
                </label>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('twoFactorAuth')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-700">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
