import { useState } from 'react'
import { supabase } from '../supabase'
import { usePaginaStore } from '../store'

export default function Planos() {
    const { perfil, carregarPerfil } = usePaginaStore()
    const [processando, setProcessando] = useState(false)

    const assinar = async (plano) => {
        setProcessando(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            const resposta = await fetch('/api/criar-assinatura', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, plano })
            })
            const { linkPagamento } = await resposta.json()
            window.location.href = linkPagamento
        } catch (erro) {
            alert('Erro: ' + erro.message)
        } finally {
            setProcessando(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-center mb-8">Escolha seu Plano</h1>
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {[
                        {
                            id: 'gratuito', nome: 'Gratuito', preco: 'R$ 0', destaque: false,
                            recursos: ['1 página', 'Link compartilhável', 'Marca d\'água visível']
                        },
                        {
                            id: 'basico', nome: '⭐ Básico', preco: 'R$ 19/mês', destaque: true,
                            recursos: ['Até 3 páginas', 'Sem marca d\'água', 'Domínio próprio', 'Estatísticas']
                        },
                        {
                            id: 'pro', nome: '✨ Pro', preco: 'R$ 39/mês', destaque: false,
                            recursos: ['Até 10 páginas', 'Tudo do Básico', 'Suporte prioritário', 'Formulários avançados']
                        }
                    ].map(plano => (
                        <div key={plano.id} className={`rounded-xl p-6 ${plano.destaque ? 'bg-green-50 border-2 border-green-500 shadow-lg' : 'bg-white shadow'
                            }`}>
                            <h3 className="font-bold text-lg">{plano.nome}</h3>
                            <p className="text-2xl font-bold my-3">{plano.preco}</p>
                            <ul className="space-y-2 text-sm text-gray-600 mb-6">
                                {plano.recursos.map((r, i) => <li key={i}>✓ {r}</li>)}
                            </ul>
                            <button
                                onClick={() => assinar(plano.id)}
                                disabled={processando || perfil?.plano === plano.id || plano.id === 'gratuito'}
                                className={`w-full py-2 rounded-lg font-medium ${perfil?.plano === plano.id ? 'bg-gray-200 text-gray-500'
                                        : plano.destaque ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                    }`}>
                                {perfil?.plano === plano.id ? 'Seu plano ✅' : plano.id === 'gratuito' ? 'Ativo' : 'Escolher'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}