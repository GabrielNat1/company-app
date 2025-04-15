import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Building2, LogIn } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">EmpresaDemo</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600 px-3 py-2">Início</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 px-3 py-2">Sobre</Link>
            <Link to="/sign-in" className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              <LogIn className="h-4 w-4" />
              <span>Entrar</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <Link to="/" className="block text-gray-600 hover:text-blue-600 px-3 py-2">Início</Link>
            <Link to="/about" className="block text-gray-600 hover:text-blue-600 px-3 py-2">Sobre</Link>
            <Link to="/sign-in" className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mt-2">
              <LogIn className="h-4 w-4" />
              <span>Entrar</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}