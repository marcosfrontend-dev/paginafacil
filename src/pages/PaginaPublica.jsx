import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import Previsualizacao from '../components/Previsualizacao'

export default function PaginaPublica() {
    const { slug } = useParams()
    const [pagina, setPagina] = useState(null)
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        async function carregar() {
            const dominio = window.location.hostname
            let dadosPagina = null

            if (!dominio.includes('paginafacil.vercel.app') && dominio !== 'localhost:5173') {
                const { data } = await supabase.from('paginas')
                    .select('conteudo, publicado, plano_atual')
                    .eq('dominio_personalizado', dominio).single()
                if (data && data.publicado) dadosPagina = { ...data.conteudo, plano_atual: data.plano_atual }
            }

            if (!dadosPagina) {
                const { data } = await supabase.from('paginas')
                    .select('conteudo, publicado, plano_atual')
                    .eq('slug', slug).eq('publicado', true).single()
                if (data && data.publicado) dadosPagina = { ...data.conteudo, plano_atual: data.plano_atual }
            }

            setPagina(dadosPagina)
            setCarregando(false)
        }
        carregar()
    }, [slug])

    if (carregando) return <div className="p-8 text-center">Carregando...</div>
    if (!pagina) return <div className="p-8 text-center text-gray-500">Página não encontrada</div>

    return <Previsualizacao pagina={pagina} />
}