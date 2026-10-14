const axios = require('axios')

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ erro: 'Método não permitido' })
    }

    const { email, plano } = req.body

    const precos = {
        basico: { valor: 1900, id: 'PAGFACIL_BASICO' },
        pro: { valor: 3900, id: 'PAGFACIL_PRO' }
    }

    const dadosPlano = precos[plano]
    if (!dadosPlano) {
        return res.status(400).json({ erro: 'Plano inválido' })
    }

    try {
        const urlSite = process.env.URL_SITE || 'http://localhost:5173'

        const resposta = await axios.post(
            'https://api.mercadopago.com/preferences',
            {
                items: [
                    {
                        id: dadosPlano.id,
                        title: `Plano ${plano === 'basico' ? 'Básico' : 'Pro'} — PáginaFácil`,
                        quantity: 1,
                        unit_price: dadosPlano.valor / 100,
                        currency_id: 'BRL'
                    }
                ],
                payer: { email },
                back_urls: {
                    success: `${urlSite}/sucesso`,
                    failure: `${urlSite}/planos`,
                    pending: `${urlSite}/aguardando`
                },
                auto_return: 'approved',
                notification_url: `${urlSite}/api/webhook-mercadopago`,
                external_reference: `plano_${plano}`
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        res.status(200).json({ linkPagamento: resposta.data.init_point })
    } catch (erro) {
        console.error('Erro Mercado Pago:', erro?.response?.data || erro.message)
        res.status(500).json({ erro: 'Falha ao criar pagamento' })
    }
}