import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-[500px] rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
            alt="Office"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-transparent flex items-center">
            <div className="text-white max-w-2xl px-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Transformando ideias em realidade
              </h1>
              <p className="text-lg md:text-xl mb-8">
                Somos uma empresa comprometida com a inovação e excelência,
                oferecendo soluções que impulsionam o sucesso do seu negócio.
              </p>
              <Link 
                to="/about" // Atualizado de "/sobre" para "/about"
                className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md transition duration-300"
              >
                <span>Saiba mais</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Soluções Personalizadas</h3>
          <p className="text-gray-600">
            Desenvolvemos soluções sob medida para atender às necessidades específicas do seu negócio.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Suporte 24/7</h3>
          <p className="text-gray-600">
            Nossa equipe está sempre disponível para ajudar você.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Tecnologia Avançada</h3>
          <p className="text-gray-600">
            Utilizamos as mais recentes tecnologias para garantir os melhores resultados.
          </p>
        </div>
      </div>
    </div>
  );
}
