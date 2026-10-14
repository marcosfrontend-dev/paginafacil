import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { usePaginaStore } from '../store'

export default function Painel() {
    const { listaPaginas, perfil, carregarMinhasPaginas, carregarPerfil, excluirPagina } = usePaginaStore()

    useEffect(() => { carregarPerfil(); carregarMinhasPaginas() }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow px-6 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h1 className="font-bold text-xl text-green-600">📊 Meu Painel</h1>
                    <div className="flex gap-4 items-center">
                        <span className="text-sm px-2 py-1 bg-green-50 text-green-700 rounded-full">
                            Plano: {perfil?.plano === 'pro' ? '✨ Pro' : perfil?.plano === 'basico' ? '⭐ Básico' : '🆓 Gratuito'}
                        </span>
                        <Link to="/app" className="text-sm text-gray-600 hover:text-green-600">← Editor</Link>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-6">
                <section className="mb-8">
                    <h2 className="text-lg font-bold mb-4">Minhas Páginas</h2>
                    {listaPaginas.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl text-center shadow-sm">
                            <p className="text-gray-500 mb-4">Você ainda não criou nenhuma página</p>
                            <Link to="/app" className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                                Criar primeira página →
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {listaPaginas.map(pag => (
                                <div key={pag.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">{pag.titulo}</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {pag.dominio_personalizado || `${window.location.origin}/${pag.slug}`}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link to="/app" className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">Editar</Link>
                                        <a href={`/${pag.slug}`} target="_blank" rel="noreferrer"
                                            className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100">Ver</a>
                                        <button onClick={() => excluirPagina(pag.id)}
                                            className="px-3 py-1 text-sm text-red-500 hover:bg-red-50">Excluir</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-bold mb-4">Seu Plano</h3>
                    <div className="space-y-3 text-sm">
                        <p className="flex justify-between">
                            <span>Páginas criadas</span>
                            <span className="font-medium">{listaPaginas.length} / {perfil?.limite_paginas || 1}</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Marca d'água</span>
                            <span className={perfil?.sem_marca_dagua ? 'text-green-600' : 'text-orange-500'}>
                                {perfil?.sem_marca_dagua ? 'Removida ✅' : 'Ativa'}
                            </span>
                        </p>
                    </div>
                    <Link to="/planos" className="mt-4 inline-block w-full text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Assinar Plano Básico — R$ 19/mês
                    </Link>
                </section>
            </main>
        </div>
    )
}