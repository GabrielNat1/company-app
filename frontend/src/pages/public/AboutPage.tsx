import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Sobre Nós</h1>
        
        <div className="prose prose-lg">
          <p className="text-gray-600 mb-6">
            Somos uma empresa dedicada a criar experiências excepcionais através da tecnologia.
            Nossa missão é transformar ideias em soluções inovadoras que impactam positivamente
            a vida das pessoas.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Nossa Missão</h2>
          <p className="text-gray-600 mb-6">
            Proporcionar soluções tecnológicas inovadoras que ajudem organizações e indivíduos
            a alcançarem seu máximo potencial.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Nossos Valores</h2>
          <ul className="list-disc list-inside text-gray-600 mb-6">
            <li>Inovação constante</li>
            <li>Excelência em cada detalhe</li>
            <li>Compromisso com o cliente</li>
            <li>Responsabilidade social</li>
          </ul>

          <div className="mt-12">
            <Link
              to="/"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Voltar para Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
