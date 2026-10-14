export default function Previsualizacao({ pagina }) {
    const telLimpo = pagina.telefone.replace(/\D/g, '')
    const linkWhats = telLimpo.length >= 11 ? `https://wa.me/55${telLimpo}` : null
    const semMarcaDagua = pagina.plano_atual !== 'gratuito'

    const BotaoWhats = () => linkWhats && (
        <a href={linkWhats} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium text-sm"
            style={{ backgroundColor: '#25D366' }}>
            💬 Falar no WhatsApp
        </a>
    )

    return (
        <div className="min-h-screen bg-white">
            <section className="py-14 px-6 text-center text-white" style={{ backgroundColor: pagina.corPrimaria }}>
                <h1 className="text-2xl font-bold mb-2">{pagina.titulo || 'Seu Negócio'}</h1>
                <p className="opacity-90 max-w-sm mx-auto text-sm">{pagina.descricao || 'Preencha a descrição'}</p>
                <div className="mt-6"><BotaoWhats /></div>
            </section>

            {pagina.tipo === 'cardapio' && pagina.secoes.includes('cardapio') && (
                <section className="py-10 px-6">
                    <h2 className="text-xl font-bold text-center mb-6" style={{ color: pagina.corPrimaria }}>🍽️ Nosso Cardápio</h2>
                    <div className="space-y-4 max-w-md mx-auto">
                        {pagina.itens.map((item, i) => (
                            <div key={i} className="border-b pb-3">
                                <div className="flex justify-between font-medium">
                                    <span>{item.nome || 'Nome do prato'}</span>
                                    <span className="font-bold" style={{ color: pagina.corSecundaria }}>{item.preco || 'R$ 0,00'}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{item.descricao || ''}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {pagina.tipo === 'servicos' && pagina.secoes.includes('servicos') && (
                <section className="py-10 px-6 bg-gray-50">
                    <h2 className="text-xl font-bold text-center mb-6" style={{ color: pagina.corPrimaria }}>🛠️ Nossos Serviços</h2>
                    <div className="space-y-4 max-w-md mx-auto">
                        {pagina.itens.map((item, i) => (
                            <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                                <h3 className="font-bold">{item.nome || 'Nome do serviço'}</h3>
                                <p className="text-sm text-gray-600 mt-1">{item.descricao || ''}</p>
                                {item.preco && <p className="mt-2 font-medium" style={{ color: pagina.corSecundaria }}>A partir de {item.preco}</p>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {pagina.tipo === 'loja' && pagina.secoes.includes('produtos') && (
                <section className="py-10 px-6 bg-gray-50">
                    <h2 className="text-xl font-bold text-center mb-6" style={{ color: pagina.corPrimaria }}>🛍️ Produtos</h2>
                    <div className="space-y-4 max-w-md mx-auto">
                        {pagina.itens.map((item, i) => (
                            <div key={i} className="bg-white p-4 rounded-lg shadow-sm flex gap-3">
                                <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                                    {item.imagem ? (
                                        <img src={item.imagem} alt={item.nome} loading="lazy" className="w-full h-full object-cover" />
                                    ) : <span className="flex items-center justify-center h-full text-gray-300 text-xs">📷</span>}
                                </div>
                                <div>
                                    <h3 className="font-bold">{item.nome || 'Nome do produto'}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{item.descricao || ''}</p>
                                    <p className="mt-1 font-bold" style={{ color: pagina.corSecundaria }}>{item.preco || 'R$ 0,00'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {pagina.secoes.includes('contato') && (
                <section className="py-10 px-6" style={{ backgroundColor: '#f9fafb' }}>
                    <h2 className="text-xl font-bold text-center mb-6" style={{ color: pagina.corPrimaria }}>📍 Contato</h2>
                    <div className="max-w-md mx-auto space-y-2 text-center text-sm">
                        <p>📍 {pagina.endereco || 'Informe seu endereço'}</p>
                        <p>🕐 {pagina.horario || 'Informe o horário'}</p>
                        <p>📞 {pagina.telefone || '(81) 9XXXX-XXXX'}</p>
                        <div className="mt-4"><BotaoWhats /></div>
                    </div>
                </section>
            )}

            {!semMarcaDagua && (
                <footer className="py-4 text-center text-xs text-gray-400">
                    Criado com ❤️ por <a href="/" className="font-medium">PáginaFácil</a>
                </footer>
            )}
        </div>
    )
}