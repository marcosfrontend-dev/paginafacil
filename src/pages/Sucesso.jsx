import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Sucesso() {
    const navegar = useNavigate()
    useEffect(() => {
        const timer = setTimeout(() => navegar('/painel'), 5000)
        return () => clearTimeout(timer)
    }, [navegar])

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
            <div className="text-center">
                <div className="text-5xl mb-4">✅</div>
                <h1 className="text-2xl font-bold text-green-700 mb-2">Pagamento Confirmado!</h1>
                <p className="text-gray-600 mb-4">Seu plano foi ativado com sucesso.</p>
                <p className="text-sm text-gray-500">Você será redirecionado em instantes...</p>
            </div>
        </div>
    )
}