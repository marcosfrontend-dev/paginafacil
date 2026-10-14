export default function Aguardando() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-50 p-6">
            <div className="text-center">
                <div className="text-5xl mb-4">⏳</div>
                <h1 className="text-2xl font-bold text-yellow-700 mb-2">Pagamento em Análise</h1>
                <p className="text-gray-600 mb-4">Assim que confirmado, seu plano será ativado automaticamente.</p>
                <p className="text-sm text-gray-500">Acompanhe pelo Painel → /painel</p>
            </div>
        </div>
    )
}