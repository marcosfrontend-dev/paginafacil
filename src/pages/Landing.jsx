import { Link } from 'react-router-dom'

export default function Landing() {
    return (
        <div className="min-h-screen bg-white">
            <header className="px-6 py-4 flex justify-between items-center max-w-6xl mx-auto">
                <h1 className="font-bold text-xl text-green-600">PáginaFácil</h1>
                <Link to="/app" className="text-gray-700 hover:text-green-600 font-medium">Entrar / Criar conta</Link>
            </header>

            <section className="px-6 py-16 text-center max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    Crie o site do seu negócio <span className="text-green-600">em 5 minutos</span>, sem saber programar
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Ideal para comércios, prestadores e profissionais locais. Preencha seus dados e ganhe um link pronto para compartilhar no WhatsApp.
                </p>
                <Link to="/app" className="inline-block bg-green-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-green-700">
                    🚀 Criar minha página — Grátis
                </Link>
                <p className="mt-4 text-sm text-gray-500">Sem cartão de crédito • Sem mensalidade obrigatória</p>
            </section>

            <section className="px-6 py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h3 className="text-2xl font-bold text-center mb-10">Escolha o seu modelo</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                            { icone: '📄', nome: 'Geral', desc: 'Página simples completa' },
                            { icone: '🍽️', nome: 'Cardápio', desc: 'Restaurantes e lanchonetes' },
                            { icone: '🛠️', nome: 'Serviços', desc: 'Profissionais e prestadores' },
                            { icone: '✨', nome: 'Portfólio', desc: 'Artistas e trabalhos visuais' },
                            { icone: '🛍️', nome: 'Loja', desc: 'Produtos à venda' }
                        ].map(m => (
                            <div key={m.nome} className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition">
                                <div className="text-3xl mb-3">{m.icone}</div>
                                <h4 className="font-bold text-gray-900">{m.nome}</h4>
                                <p className="text-sm text-gray-500 mt-1">{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="px-6 py-8 border-t text-center text-sm text-gray-500">
                <p>PáginaFácil — Vitrines digitais para pequenos negócios</p>
                <p className="mt-2">Recife • Pernambuco 🇧🇷</p>
            </footer>
        </div>
    )
}