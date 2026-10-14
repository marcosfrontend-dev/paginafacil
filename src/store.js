import { create } from 'zustand'
import { supabase } from './supabase'

const modelos = {
    padrao: {
        titulo: 'Meu Negócio', descricao: '', telefone: '', endereco: '', horario: '',
        corPrimaria: '#16a34a', corSecundaria: '#f97316', secoes: ['hero', 'sobre', 'contato'],
        tipo: 'padrao', galeria: [], itens: []
    },
    cardapio: {
        titulo: '', descricao: 'Comida caseira, feita com carinho e entregue na sua porta.',
        telefone: '', endereco: '', horario: 'Seg–Dom: 11h–23h',
        corPrimaria: '#b91c1c', corSecundaria: '#f59e0b', secoes: ['hero', 'cardapio', 'contato'],
        tipo: 'cardapio', galeria: [], itens: [{ nome: '', preco: '', descricao: '' }]
    },
    servicos: {
        titulo: '', descricao: 'Soluções rápidas e confiáveis para você e sua família.',
        telefone: '', endereco: '', horario: 'Seg–Sex: 8h–18h',
        corPrimaria: '#2563eb', corSecundaria: '#64748b', secoes: ['hero', 'servicos', 'contato'],
        tipo: 'servicos', galeria: [], itens: [{ nome: '', descricao: '', preco: '' }]
    },
    portfolio: {
        titulo: '', descricao: 'Trabalhos com dedicação, qualidade e atenção aos detalhes.',
        telefone: '', endereco: '', horario: 'Atendimento com hora marcada',
        corPrimaria: '#4f46e5', corSecundaria: '#ec4899', secoes: ['hero', 'trabalhos', 'contato'],
        tipo: 'portfolio', galeria: [], itens: []
    },
    loja: {
        titulo: '', descricao: 'Produtos selecionados com entrega rápida na região.',
        telefone: '', endereco: '', horario: 'Seg–Sáb: 9h–19h',
        corPrimaria: '#0d9488', corSecundaria: '#eab308', secoes: ['hero', 'produtos', 'contato'],
        tipo: 'loja', galeria: [], itens: [{ nome: '', preco: '', descricao: '', imagem: '' }]
    }
}

export const usePaginaStore = create((set, get) => ({
    pagina: { ...modelos.padrao },
    listaPaginas: [], perfil: null, carregando: false, salvo: false,

    escolherModelo: (tipo) => set({ pagina: { ...modelos[tipo] }, salvo: false }),
    setCampo: (campo, valor) => set(s => ({ pagina: { ...s.pagina, [campo]: valor }, salvo: false })),

    adicionarItem: () => set(s => ({
        pagina: { ...s.pagina, itens: [...s.pagina.itens, { nome: '', preco: '', descricao: '' }] },
        salvo: false
    })),

    atualizarItem: (indice, campo, valor) => set(s => {
        const itens = [...s.pagina.itens]
        itens[indice][campo] = valor
        return { pagina: { ...s.pagina, itens }, salvo: false }
    }),

    removerItem: (indice) => set(s => ({
        pagina: { ...s.pagina, itens: s.pagina.itens.filter((_, i) => i !== indice) },
        salvo: false
    })),

    carregarPerfil: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data } = await supabase.from('perfis_usuario').select('*').eq('usuario_id', user.id).single()
        set({ perfil: data })
    },

    carregarMinhasPaginas: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data } = await supabase.from('paginas')
            .select('id, slug, titulo, publicado, atualizado_em, dominio_personalizado')
            .eq('usuario_id', user.id).order('atualizado_em', { ascending: false })
        set({ listaPaginas: data || [] })
    },

    excluirPagina: async (id) => {
        if (!confirm('Tem certeza?')) return
        await supabase.from('paginas').delete().eq('id', id)
        get().carregarMinhasPaginas()
    },

    salvarPagina: async () => {
        set({ carregando: true, salvo: false })
        const { pagina, perfil, listaPaginas } = get()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return alert('Faça login primeiro')

        const limite = perfil?.limite_paginas || 1
        if (listaPaginas.length >= limite) {
            alert(`Limite atingido! Atualize seu plano para criar mais páginas.`)
            return set({ carregando: false })
        }

        const slug = pagina.titulo.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').substring(0, 40)
        const { error } = await supabase.from('paginas').upsert({
            usuario_id: user.id, slug, titulo: pagina.titulo, conteudo: { ...pagina, slug },
            publicado: true, atualizado_em: new Date()
        })
        if (!error) set(s => ({ pagina: { ...s.pagina, slug }, carregando: false, salvo: true }))
        else alert('Erro: ' + error.message)
    }
}))