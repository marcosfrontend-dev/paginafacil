import { useState } from 'react'
import { supabase } from '../supabase'

export default function UploadImagem({ aoSubir, valorAtual }) {
    const [enviando, setEnviando] = useState(false)

    async function handleChange(e) {
        const arquivo = e.target.files[0]
        if (!arquivo) return
        setEnviando(true)

        const reduzirImagem = (arquivo, larguraMax = 800) => new Promise(resolve => {
            const leitor = new FileReader()
            leitor.onload = (e) => {
                const img = new Image()
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    let w = img.width, h = img.height
                    if (w > larguraMax) { h = (h * larguraMax) / w; w = larguraMax }
                    canvas.width = w; canvas.height = h
                    const ctx = canvas.getContext('2d')
                    ctx.drawImage(img, 0, 0, w, h)
                    canvas.toBlob(blob => resolve(new File([blob], arquivo.name, { type: 'image/jpeg' })), 'image/jpeg', 0.8)
                }
                img.src = e.target.result
            }
            leitor.readAsDataURL(arquivo)
        })

        const arquivoOtimizado = await reduzirImagem(arquivo)
        const nomeArquivo = `${Date.now()}-imagem.jpg`

        const { data, error } = await supabase.storage
            .from('paginas-imagens')
            .upload(nomeArquivo, arquivoOtimizado, { cacheControl: '31536000' })

        if (!error) {
            const { data: { publicUrl } } = supabase.storage.from('paginas-imagens').getPublicUrl(nomeArquivo)
            aoSubir(publicUrl)
        } else alert('Erro: ' + error.message)
        setEnviando(false)
    }

    return (
        <div className="space-y-2">
            {valorAtual ? (
                <div className="relative w-20 h-20 rounded overflow-hidden border">
                    <img src={valorAtual} alt="Prévia" className="w-full h-full object-cover" />
                    <button onClick={() => aoSubir('')}
                        className="absolute top-0 right-0 bg-black/50 text-white w-5 h-5 flex items-center justify-center text-xs">✕</button>
                </div>
            ) : (
                <label className="block w-20 h-20 border-2 border-dashed rounded flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50">
                    {enviando ? '⏳' : '+'}
                    <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
                </label>
            )}
        </div>
    )
}