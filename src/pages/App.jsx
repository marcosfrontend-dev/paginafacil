import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { usePaginaStore } from '../store'
import Previsualizacao from '../components/Previsualizacao'
import UploadImagem from '../components/UploadImagem'

export default function App() {
    const [usuario, setUsuario] = useState(null)
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [modo, setModo] = useState('login')
    const navegar = useNavigate()

    const { pagina, escolherModelo, setCampo, adicionarItem, atualizarItem, removerItem, salvarPagina, salvo, carregando } = usePaginaStore()

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setUsuario(session?.user || null)
            if (!session) navegar('/')
        })
        return () => subscription.unsubscribe()
    }, [navegar])

    async function cadastrarOuEntrar(e) {
        e.preventDefault()
        if (modo === 'cadastro') await supabase.auth.signUp({ email, password: senha })
        else await supabase.auth.signInWithPassword({ email, password: senha })
    }

    if (!usuario) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                    <h1 className="text-2xl font-bold text-center mb-6">PáginaFácil</h1>
                    <form onSubmit={cadastrarOuEntrar} className="space-y-4">
                        <input type="email" placeholder="Seu e-mail" value={email}
                            onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-lg" required />
                        <input type="password" placeholder="Sua senha" value={senha}
                            onChange={e => setSenha(e.target.value)} className="w-full p-3 border rounded-lg" required />
                        <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg font-medium hover:bg-green-700">
                            {modo === 'cadastro' ? 'Criar Conta' : 'Entrar'}
                        </button>
                    </form>
                    <p className="mt-4 text-center text-sm">
                        {modo === 'login' ? 'Não tem conta?' : 'Já tem conta?'}
                        <button onClick={() => setModo(modo === 'login' ? 'cadastro' : 'login')}
                            className="ml-1 text-green-600 font-medium">
                            {modo === 'login' ? 'Criar agora' : 'Entrar'}
                        </button>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow px-6 py-3 flex justify-between items-center">
                <h1 className="font-bold text-lg">PáginaFácil</h1>
                <nav className="flex gap-4 text-sm">
                    <Link to="/painel" className="text-gray-600 hover:text-green-600">Meu Painel</Link>
                    <button onClick={() => supabase.auth.signOut()} className="text-gray-500 hover:text-red-500">Sair</button>
                </nav>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-56px)]">
                <div className="p-6 space-y-6 overflow-y-auto">
                    <h2 className="text-xl font-bold">✏️ Crie sua página</h2>

                    <section className="space-y-3">
                        <h3 className="font-semibold text-gray-700">1. Escolha um modelo</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'padrao', nome: 'Geral', icone: '📄' },
                                { id: 'cardapio', nome: 'Cardápio', icone: '🍽️' },
                                { id: 'servicos', nome: 'Serviços', icone: '🛠️' },
                                { id: 'portfolio', nome: 'Portfólio', icone: '✨' },
                                { id: 'loja', nome: 'Loja', icone: '🛍️' }
                            ].map(m => (
                                <button key={m.id} onClick={() => escolherModelo(m.id)}
                                    className={`p-3 rounded-lg text-left text-sm transition ${pagina.tipo === m.id ? 'bg-green-50 border-2 border-green-500 font-medium' : 'bg-white border hover:bg-gray-50'
                                        }`}>
                                    {m.icone} {m.nome}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="font-semibold text-gray-700">2. Seus dados</h3>
                        <div>
                            <label className="block text-sm font-medium mb-1">Nome / Título *</label>
                            <input value={pagina.titulo} onChange={e => setCampo('titulo', e.target.value)}
                                className="w-full p-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Descrição</label>
                            <textarea value={pagina.descricao} onChange={e => setCampo('descricao', e.target.value)}
                                className="w-full p-2 border rounded-lg" rows={2} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">WhatsApp *</label>
                            <input value={pagina.telefone} onChange={e => setCampo('telefone', e.target.value)}
                                className="w-full p-2 border rounded-lg" placeholder="(81) 9XXXX-XXXX" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Endereço</label>
                            <input value={pagina.endereco} onChange={e => setCampo('endereco', e.target.value)}
                                className="w-full p-2 border rounded-lg" placeholder="Bairro, Recife - PE" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Horário</label>
                            <input value={pagina.horario} onChange={e => setCampo('horario', e.target.value)}
                                className="w-full p-2 border rounded-lg" placeholder="Seg–Sex: 8h–18h" />
                        </div>
                    </section>

                    {['cardapio', 'servicos', 'loja'].includes(pagina.tipo) && (
                        <section className="space-y-3">
                            <h3 className="font-semibold text-gray-700">
                                3. {pagina.tipo === 'cardapio' ? 'Pratos' : pagina.tipo === 'servicos' ? 'Serviços' : 'Produtos'}
                            </h3>
                            {pagina.itens.map((item, i) => (
                                <div key={i} className="border p-3 rounded-lg space-y-2 relative">
                                    <button onClick={() => removerItem(i)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xs">✕</button>
                                    <div className="flex gap-3">
                                        <UploadImagem valorAtual={item.imagem} aoSubir={(url) => atualizarItem(i, 'imagem', url)} />
                                        <div className="flex-1 space-y-2">
                                            <input placeholder="Nome" value={item.nome}
                                                onChange={e => atualizarItem(i, 'nome', e.target.value)}
                                                className="w-full p-2 border rounded text-sm" />
                                            <input placeholder="Preço — ex: R$ 25,90" value={item.preco}
                                                onChange={e => atualizarItem(i, 'preco', e.target.value)}
                                                className="w-full p-2 border rounded text-sm" />
                                            <textarea placeholder="Descrição" value={item.descricao}
                                                onChange={e => atualizarItem(i, 'descricao', e.target.value)}
                                                className="w-full p-2 border rounded text-sm" rows={2} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={adicionarItem}
                                className="text-green-600 text-sm font-medium hover:text-green-700">
                                + Adicionar {pagina.tipo === 'cardapio' ? 'prato' : pagina.tipo === 'servicos' ? 'serviço' : 'produto'}
                            </button>
                        </section>
                    )}

                    <section className="space-y-4">
                        <h3 className="font-semibold text-gray-700">4. Cores</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Principal</label>
                                <input type="color" value={pagina.corPrimaria}
                                    onChange={e => setCampo('corPrimaria', e.target.value)}
                                    className="w-full h-12 rounded cursor-pointer" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Destaque</label>
                                <input type="color" value={pagina.corSecundaria}
                                    onChange={e => setCampo('corSecundaria', e.target.value)}
                                    className="w-full h-12 rounded cursor-pointer" />
                            </div>
                        </div>
                    </section>

                    <button onClick={salvarPagina} disabled={carregando}
                        className="w-full py-3 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50">
                        {carregando ? 'Salvando...' : salvo ? '✅ Salvo! Seu link:' : '🚀 Criar minha página'}
                    </button>

                    {salvo && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm font-medium mb-1">Compartilhe este link:</p>
                            <div className="flex gap-2">
                                <input readOnly value={`${window.location.origin}/${pagina.slug}`}
                                    className="flex-1 p-2 text-sm bg-white border rounded" />
                                <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${pagina.slug}`)}
                                    className="px-3 bg-green-600 text-white rounded text-sm hover:bg-green-700">Copiar</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-200 p-4">
                    <div className="text-xs text-gray-500 mb-2 text-center">Prévia em tempo real</div>
                    <div className="bg-white rounded-lg shadow overflow-hidden max-w-md mx-auto">
                        <Previsualizacao pagina={pagina} />
                    </div>
                </div>
            </div>
        </div>
    )
}