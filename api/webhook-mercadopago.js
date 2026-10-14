const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
    const { type, data } = req.body

    // Ignora tipos que não são pagamento
    if (type !== 'payment') {
        return res.status(200).send('Ignorado')
    }

    try {
        // Busca detalhes do pagamento no Mercado Pago
        const resposta = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
            headers: {
                'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`
            }
        })

        const pagamento = await resposta.json()

        // Só processa se foi aprovado
        if (pagamento.status === 'approved') {
            const emailPagador = pagamento.payer.email
            const referencia = pagamento.external_reference || ''

            // Define qual plano foi comprado
            let plano = 'gratuito'
            if (referencia.includes('basico')) plano = 'basico'
            if (referencia.includes('pro')) plano = 'pro'

            const limitePaginas = plano === 'basico' ? 3 : plano === 'pro' ? 10 : 1

            // Busca o usuário pelo e-mail
            const { data: usuario } = await supabase
                .from('auth.users')
                .select('id')
                .eq('email', emailPagador)
                .single()

            if (usuario?.id) {
                // Atualiza o perfil do usuário
                await supabase
                    .from('perfis_usuario')
                    .upsert({
                        usuario_id: usuario.id,
                        plano,
                        limite_paginas,
                        sem_marca_dagua: plano !== 'gratuito',
                        data_ativacao_plano: new Date()
                    }, { onConflict: 'usuario_id' })
            }
        }

        res.status(200).send('Processado')
    } catch (erro) {
        console.error('Erro no webhook:', erro.message)
        res.status(500).send('Erro')
    }
}