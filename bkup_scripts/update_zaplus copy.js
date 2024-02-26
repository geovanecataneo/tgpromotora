const fs = require('fs');
const readline = require('readline');
const path = require('path');
const axios = require('axios');
const knex = require('./conn/knex_config');
const helpers = require('./helpers/helpers');
const apiKey = 'a33ea43e-198c-471f-8e27-21842078881a';

// console.log('\n****************************************************************************\n');

async function execute(csvFilePath) {

    const fileStream = fs.createReadStream(csvFilePath, { encoding: 'utf-8' });
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    let header = null;

    for await (const line of rl) {
        if (!header) {
            header = true;
        } else {
            const columns = line.split(';');

            const obj = {
                nome: await helpers.formatUpperCase(columns[0]),
                cpf: await helpers.formatUpperCase(columns[1]),
                matricula: await helpers.formatUpperCase(columns[2]),
                convenio: await helpers.formatUpperCase(columns[3]),
                especie: await helpers.formatUpperCase(columns[4]),
                dib: await helpers.formatUpperCase(columns[5]),
                desbloqueio: await helpers.formatUpperCase(columns[6]),
                nascimento: await helpers.formatUpperCase(columns[7]),
                idade: await helpers.formatUpperCase(columns[8]),
                salario: await helpers.formatUpperCase(columns[9]),
                margem: await helpers.formatUpperCase(columns[10]),
                cc: await helpers.formatUpperCase(columns[11]),
                cb: await helpers.formatUpperCase(columns[12]),
                valor_liberado: await helpers.formatUpperCase(columns[13]),
                cartao_liberado: await helpers.formatUpperCase(columns[14]),
                parcela_port_refin: await helpers.formatUpperCase(columns[15]),
                banco_port_refin: await helpers.formatUpperCase(columns[16]),
                pagas_port_refin: await helpers.formatUpperCase(columns[17]),
                prazo_port_refin: await helpers.formatUpperCase(columns[18]),
                saldo_port_refin: await helpers.formatUpperCase(columns[19]),
                taxa_port_refin: await helpers.formatUpperCase(columns[20]),
                inicio: await helpers.formatUpperCase(columns[21]),
                final: await helpers.formatUpperCase(columns[22]),
                averbacao: await helpers.formatUpperCase(columns[23]),
                emprestimo: await helpers.formatUpperCase(columns[24]),
                parcela_reduzida: await helpers.formatUpperCase(columns[25]),
                reducao: await helpers.formatUpperCase(columns[26]),
                economia: await helpers.formatUpperCase(columns[27]),
                refin_da_port: await helpers.formatUpperCase(columns[28]),
                saque_fgts: await helpers.formatUpperCase(columns[29]),
                contato1: await helpers.formatUpperCase(columns[30]),
                contato2: await helpers.formatUpperCase(columns[31]),
                rua: await helpers.formatUpperCase(columns[32]),
                numero: await helpers.formatUpperCase(columns[33]),
                complemento: await helpers.formatUpperCase(columns[34]),
                bairro: await helpers.formatUpperCase(columns[35]),
                cidade: await helpers.formatUpperCase(columns[36]),
                uf: await helpers.formatUpperCase(columns[37]),
                cep: await helpers.formatUpperCase(columns[38]),
                meio_pgto: await helpers.formatUpperCase(columns[39]),
                banco_recebe: await helpers.formatUpperCase(columns[40]),
                agencia: await helpers.formatUpperCase(columns[41]),
                conta: await helpers.formatUpperCase(columns[42]),
                sexo: await helpers.formatUpperCase(columns[43]),
                linhas: await helpers.formatUpperCase(columns[44]),
                convenio_tab: await helpers.formatUpperCase(columns[45]),
                operacao: await helpers.formatUpperCase(columns[46]),
                instituicao: await helpers.formatUpperCase(columns[47]),
                taxa: await helpers.formatUpperCase(columns[48]),
                prazo: await helpers.formatUpperCase(columns[49]),
                especialidade: await helpers.formatUpperCase(columns[50]),
                coeficiente: await helpers.formatUpperCase(columns[51]),
                peso: await helpers.formatUpperCase(columns[52]),
                pontos: await helpers.formatUpperCase(columns[53]),
                valor_liberado_tab: await helpers.formatUpperCase(columns[54]),
                parcela_equivalente: await helpers.formatUpperCase(columns[55]),
                prazo_remanescente: await helpers.formatUpperCase(columns[56]),
                score: await helpers.formatUpperCase(columns[57]),
                score_faixa: await helpers.formatUpperCase(columns[58]),
                score_digital: await helpers.formatUpperCase(columns[59]),
                classeeconomica: await helpers.formatUpperCase(columns[60]),
                renda: await helpers.formatUpperCase(columns[61]),
                nome_mae: await helpers.formatUpperCase(columns[62]),
                rg: await helpers.formatUpperCase(columns[63])
            };

            // console.log(obj);

            console.log(`Contato enviado para o Zaplus: ${obj.contato1}`);

            // let subscriberId = await getSubscriber(`${obj.contato1}`)
            // if (!subscriberId) {
            //     subscriberId = await createSubscriber(obj)
            // }

            // console.log(subscriberId);

            // await setCustomField(subscriberId, await findFieldByKey('nome'), obj.nome)
            // await setCustomField(subscriberId, await findFieldByKey('cpf'), obj.cpf)
            // await setCustomField(subscriberId, await findFieldByKey('matricula'), obj.matricula)
            // await setCustomField(subscriberId, await findFieldByKey('convenio'), obj.convenio)
            // await setCustomField(subscriberId, await findFieldByKey('especie'), obj.especie)
            // await setCustomField(subscriberId, await findFieldByKey('dib'), obj.dib)
            // await setCustomField(subscriberId, await findFieldByKey('desbloqueio'), obj.desbloqueio)
            // await setCustomField(subscriberId, await findFieldByKey('nascimento'), obj.nascimento)
            // await setCustomField(subscriberId, await findFieldByKey('idade'), obj.idade)
            // await setCustomField(subscriberId, await findFieldByKey('salario'), obj.salario)
            // await setCustomField(subscriberId, await findFieldByKey('margem'), obj.margem)
            // await setCustomField(subscriberId, await findFieldByKey('cc'), obj.cc)
            // await setCustomField(subscriberId, await findFieldByKey('cb'), obj.cb)
            // await setCustomField(subscriberId, await findFieldByKey('valor_liberado'), obj.valor_liberado)
            // await setCustomField(subscriberId, await findFieldByKey('cartao_liberado'), obj.cartao_liberado)
            // await setCustomField(subscriberId, await findFieldByKey('parcela_port_refin'), obj.parcela_port_refin)
            // await setCustomField(subscriberId, await findFieldByKey('banco_port_refin'), obj.banco_port_refin)
            // await setCustomField(subscriberId, await findFieldByKey('pagas_port_refin'), obj.pagas_port_refin)
            // await setCustomField(subscriberId, await findFieldByKey('prazo_port_refin'), obj.prazo_port_refin)
            // await setCustomField(subscriberId, await findFieldByKey('saldo_port_refin'), obj.saldo_port_refin)
            // await setCustomField(subscriberId, await findFieldByKey('taxa_port_refin'), obj.taxa_port_refin)
            // await setCustomField(subscriberId, await findFieldByKey('inicio'), obj.inicio)
            // await setCustomField(subscriberId, await findFieldByKey('final'), obj.final)
            // await setCustomField(subscriberId, await findFieldByKey('averbacao'), obj.averbacao)
            // await setCustomField(subscriberId, await findFieldByKey('emprestimo'), obj.emprestimo)
            // await setCustomField(subscriberId, await findFieldByKey('parcela_reduzida'), obj.parcela_reduzida)
            // await setCustomField(subscriberId, await findFieldByKey('reducao'), obj.reducao)
            // await setCustomField(subscriberId, await findFieldByKey('economia'), obj.economia)
            // await setCustomField(subscriberId, await findFieldByKey('refin_da_port'), obj.refin_da_port)
            // await setCustomField(subscriberId, await findFieldByKey('saque_fgts'), obj.saque_fgts)
            // await setCustomField(subscriberId, await findFieldByKey('contato1'), obj.contato1)
            // await setCustomField(subscriberId, await findFieldByKey('contato2'), obj.contato2)
            // await setCustomField(subscriberId, await findFieldByKey('rua'), obj.rua)
            // await setCustomField(subscriberId, await findFieldByKey('numero'), obj.numero)
            // await setCustomField(subscriberId, await findFieldByKey('complemento'), obj.complemento)
            // await setCustomField(subscriberId, await findFieldByKey('bairro'), obj.bairro)
            // await setCustomField(subscriberId, await findFieldByKey('cidade'), obj.cidade)
            // await setCustomField(subscriberId, await findFieldByKey('uf'), obj.uf)
            // await setCustomField(subscriberId, await findFieldByKey('cep'), obj.cep)
            // await setCustomField(subscriberId, await findFieldByKey('meio_pgto'), obj.meio_pgto)
            // await setCustomField(subscriberId, await findFieldByKey('banco_recebe'), obj.banco_recebe)
            // await setCustomField(subscriberId, await findFieldByKey('agencia'), obj.agencia)
            // await setCustomField(subscriberId, await findFieldByKey('conta'), obj.conta)
            // await setCustomField(subscriberId, await findFieldByKey('sexo'), obj.sexo)
            // await setCustomField(subscriberId, await findFieldByKey('linhas'), obj.linhas)
            // await setCustomField(subscriberId, await findFieldByKey('convenio_tab'), obj.convenio_tab)
            // await setCustomField(subscriberId, await findFieldByKey('operacao'), obj.operacao)
            // await setCustomField(subscriberId, await findFieldByKey('instituicao'), obj.instituicao)
            // await setCustomField(subscriberId, await findFieldByKey('taxa'), obj.taxa)
            // await setCustomField(subscriberId, await findFieldByKey('prazo'), obj.prazo)
            // await setCustomField(subscriberId, await findFieldByKey('especialidade'), obj.especialidade)
            // await setCustomField(subscriberId, await findFieldByKey('coeficiente'), obj.coeficiente)
            // await setCustomField(subscriberId, await findFieldByKey('peso'), obj.peso)
            // await setCustomField(subscriberId, await findFieldByKey('pontos'), obj.pontos)
            // await setCustomField(subscriberId, await findFieldByKey('valor_liberado_tab'), obj.valor_liberado_tab)
            // await setCustomField(subscriberId, await findFieldByKey('parcela_equivalente'), obj.parcela_equivalente)
            // await setCustomField(subscriberId, await findFieldByKey('prazo_remanescente'), obj.prazo_remanescente)
            // await setCustomField(subscriberId, await findFieldByKey('score'), obj.score)
            // await setCustomField(subscriberId, await findFieldByKey('score_faixa'), obj.score_faixa)
            // await setCustomField(subscriberId, await findFieldByKey('score_digital'), obj.score_digital)
            // await setCustomField(subscriberId, await findFieldByKey('classeeconomica'), obj.classeeconomica)
            // await setCustomField(subscriberId, await findFieldByKey('renda'), obj.renda)
            // await setCustomField(subscriberId, await findFieldByKey('nome_mae'), obj.nome_mae)
            // await setCustomField(subscriberId, await findFieldByKey('rg'), obj.rg)
        }
    }
}

async function getFields() {
    const apiURL = 'https://backend.botconversa.com.br/api/v1/webhook/custom_fields/'
    const response = await axios.get(apiURL, {
        headers: {
            'accept': 'application/json',
            'API-KEY': apiKey
        }
    })

    try {
        return response.data
    } catch (error) {
        // Manipule os erros da requisição aqui
        console.error('Erro na requisição:', error);
    };

}

async function getSubscriber(contact) {
    const apiURL = `https://backend.botconversa.com.br/api/v1/webhook/subscriber/get_by_phone/55${contact}/`
    try {
        const response = await axios.get(apiURL, {
            headers: {
                'accept': 'application/json',
                'API-KEY': apiKey
            }
        });

        return response.data.id
    } catch (error) {
        return false
    }

}

async function createSubscriber(obj) {
    const apiURL = 'https://backend.botconversa.com.br/api/v1/webhook/subscriber/'
    const requestData = {
        phone: `55${obj.contato1}`,
        first_name: `${obj.nome}`,
        last_name: '@'
    }

    const response = await axios.post(apiURL, requestData, {
        headers: {
            'accept': 'application/json',
            'API-KEY': apiKey,
            'Content-Type': 'application/json'
        }
    })

    try {
        return response.data.id
    } catch (error) {
        // Manipule os erros da requisição aqui
        console.error('Erro na requisição:', error);
    };
}

async function setCustomField(subscriberId, customFieldsId, value) {
    const apiURL = `https://backend.botconversa.com.br/api/v1/webhook/subscriber/${subscriberId}/custom_fields/${customFieldsId}/`
    const requestData = {
        value: value
    };

    const response = await axios.post(apiURL, requestData, {
        headers: {
            'accept': 'application/json',
            'API-KEY': apiKey,
            'Content-Type': 'application/json'
        }
    })

    try {
        console.log('Resposta do POST:', response.data);
    } catch (error) {
        // Manipule os erros da requisição aqui
        console.error('Erro na requisição:', error);
    };
}


async function findFieldByKey(key) {
    const zaplusFields = [
        { agencia: 1480703, },
        { averbacao: 1480685, },
        { bairro: 1480697, },
        { banco_port_refin: 1480678, },
        { banco_recebe: 1480702, },
        { cartao_liberado: 1480676, },
        { cb: 1480674, },
        { cc: 1480673, },
        { cep: 1480700, },
        { cidade: 1480698, },
        { classeeconomica: 1480724, },
        { coeficiente: 1480714, },
        { complemento: 1480696, },
        { conta: 1480705, },
        { contato1: 1480692, },
        { contato2: 1480693, },
        { convenio: 1480665, },
        { convenio_tab: 1480708, },
        { cpf: 1480663, },
        { desbloqueio: 1480668, },
        { dib: 1480667, },
        { economia: 1480689, },
        { emprestimo: 1480686, },
        { especialidade: 1480713, },
        { especie: 1480666, },
        { final: 1480684, },
        { idade: 1480670, },
        { inicio: 1480683, },
        { instituicao: 1480710, },
        { linhas: 1480707, },
        { margem: 1480672, },
        { matricula: 1480664, },
        { meio_pgto: 1480701, },
        { nascimento: 1480669, },
        { nome: 1480662, },
        { nome_mae: 1480726, },
        { numero: 1480695, },
        { operacao: 1480709, },
        { pagas_port_refin: 1480679, },
        { parcela_equivalente: 1480718, },
        { parcela_port_refin: 1480677, },
        { parcela_reduzida: 1480687, },
        { peso: 1480715, },
        { pontos: 1480716, },
        { prazo: 1480712, },
        { prazo_port_refin: 1480680, },
        { prazo_remanescente: 1480719, },
        { reducao: 1480688, },
        { refin_da_port: 1480690, },
        { renda: 1480725, },
        { rg: 1480727, },
        { rua: 1480694, },
        { salario: 1480671, },
        { saldo_port_refin: 1480681, },
        { saque_fgts: 1480691, },
        { score: 1480720, },
        { score_digital: 1480723, },
        { score_faixa: 1480722, },
        { sexo: 1480706, },
        { taxa: 1480711, },
        { taxa_port_refin: 1480682, },
        { uf: 1480699, },
        { valor_liberado: 1480675, },
        { valor_liberado_tab: 1480717, }
    ]

    const field = zaplusFields.find(field => key in field);
    if (field) {
        return field[key];
    } else {
        return null;
    }
}

(async () => {
    const csvFileName = 'lista_zaplus.csv';
    const csvFilePath = path.join(__dirname, csvFileName);

    if (fs.existsSync(csvFilePath)) {
        await execute(csvFilePath);
        // console.log(await getFields())

        console.log('\nTudo pronto!');
    } else {
        console.log('Arquivos CSV não encontrado');
    }
})();