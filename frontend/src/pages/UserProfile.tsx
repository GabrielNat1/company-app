import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Phone, Shield, Save, X, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../stores/auth';
import { toast } from 'react-hot-toast';

export function UserProfile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+55 (11) 99999-9999',
    notifications: true,
    twoFactor: false
  });

  if (!user) return null;

  const handleSave = () => {
    // TODO: Implement API call to save changes
    toast.success('Perfil atualizado com sucesso!');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.')) {
      // TODO: Implement API call to delete account
      toast.success('Conta deletada com sucesso');
      signOut();
      navigate('/');
    }
  };

  const handleLogout = () => {
    signOut();
    navigate('/sign-in');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        {/* Header/Avatar Section */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg" />
          <div className="absolute -bottom-12 left-8">
            <div className="h-24 w-24 bg-gray-200 dark:bg-gray-700 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
              <User className="h-12 w-12 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-16 pb-8 px-8">
          {isEditing ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:text-white outline-none"
            />
          ) : (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h1>
          )}
          <p className="mt-2 text-gray-500 dark:text-gray-400 flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            {user.role === 'admin' ? 'Administrador' : 'Usuário'}
          </p>
        </div>

        {/* Contact Information */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <dl className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="px-8 py-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </dt>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full bg-transparent border-b border-gray-300 dark:border-gray-600 dark:text-white outline-none"
                />
              ) : (
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {user.email}
                </dd>
              )}
            </div>

            <div className="px-8 py-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Membro desde
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                Janeiro 2024
              </dd>
            </div>

            <div className="px-8 py-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Telefone
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                +55 (11) 99999-9999
              </dd>
            </div>
          </dl>
        </div>

        {/* Actions */}
        <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Editar Perfil
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Account Management */}
      <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Gerenciar Conta
        </h2>
        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair da Conta
          </button>
          <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Deletar Conta
          </button>
        </div>
      </div>
    </div>
  );
}