const crud = require('../class/db_crud')
const crypto = require('crypto');
const db = require('../conn/knex_config')

const moment = require('moment')
const currency = require('currency.js')


class helpersClass {

    async uniqArrCpfs(arr) {
        const uniqArr = [...new Set(arr)];

        return uniqArr
    }

    async returnFirstName(value) {
        const name = await this.converterParaFormatoNormal(value)
        let split = name.split(' ');

        return {
            name: split[0],
            lastName: split.slice(1).join(' ') || ''
        }
    }

    async converterParaFormatoNormal(nomeEmMaiusculas) {
        // Converte para minúsculas todas as letras, exceto a primeira de cada palavra
        return nomeEmMaiusculas.toLowerCase().replace(/(?:^|\s)\S/g, function (letra) {
            return letra.toUpperCase();
        });
    }

    async generateUniqueHash() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomPart = '';

        for (let i = 0; i < 3; i++) {
            const randomChar = characters[Math.floor(Math.random() * characters.length)];
            randomPart += randomChar;
        }

        const randPart2 = await this.generateRandomPart(4); // Gera uma parte aleatória de 6 caracteres
        const result = randomPart + randPart2

        const consult = await db.smartDbConsig.from('contacts').where('hash_contact', result)
        if (consult && consult.length > 0) {
            return this.generateUniqueHash();
        }

        return result;
    }

    async generateRandomPart(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomPart = '';

        for (let i = 0; i < length; i++) {
            const randomChar = characters[Math.floor(Math.random() * characters.length)];
            randomPart += randomChar;
        }

        return randomPart;
    }

    async uniqArrDocs(arr) {
        const uniqArr = [...new Set(arr)];

        return uniqArr
    }

    async formatTrim(value) {
        if (!!value && value !== null && value !== "NULL") {
            const trim = value.trim()
            const normalize = trim.replace(/( ){2,}/g, '$1')

            return normalize
        }

        return null
    }

    async formatUpperCase(value) {
        const trim = await this.formatTrim(value)
        if (trim !== null) {
            return trim.toUpperCase();
        }

        return trim
    }

    async formatLowerCase(value) {
        const trim = await this.formatTrim(value)
        if (trim !== null) {
            return trim.toLowerCase();
        }

        return trim
    }

    async formatCpf(value) {
        const trim = await this.formatTrim(value)
        if (trim !== null) {
            const normalize = await this.formatRemoveEspChars(trim)

            return (`00000000000${normalize}`).slice(-11)
        }
        return trim
    }

    async formatCnpj(value) {
        const trim = await this.formatTrim(value)
        if (trim !== null) {
            const normalize = await this.formatRemoveEspChars(trim)

            return (`00000000000000${normalize}`).slice(-14)
        }
        return trim
    }

    async formatRemoveEspChars(value) {
        const trim = await this.formatTrim(value)
        if (trim !== null) {
            const mathRegex = trim.match(/\d/g)
            const normalize = mathRegex.join("")

            return normalize
        }
        return trim
    }

    async formatDate(value) {
        if (typeof (value) !== 'string') return null

        const DATE_FORMATS = ['YYYY-MM-DD HH:mm:ss', 'YYYYMMDD', 'YYYY-MM-DD', 'YYYYMM', 'YYYY-MM', 'DDMMYYYY', 'DD/MM/YYYY', 'MMYYYY', 'MM/YYYY', 'DD/MM/YYYY 00:00:00'];
        const date = moment.utc(value, DATE_FORMATS, true);

        if (date.isValid()) return date.startOf('day').format('YYYY-MM-DD');

        return null;
    }

    async formatCep(value) {
        const trim = await this.formatTrim(value)
        if (trim !== null) {
            const normalize = await this.formatRemoveEspChars(trim)

            return (`00000000${normalize}`).slice(-8)
        }
        return trim
    }

    async formatBank(value) {
        const trim = await this.formatTrim(value)
        if (trim !== null) {
            const normalize = await this.formatRemoveEspChars(trim)

            return (`000${normalize}`).slice(-3)
        }
        return trim
    }


    async formatLeaveNumbers(value) {
        const trim = await this.formatTrim(value)
        if (trim !== null) {
            const normalize = trim.replace(/[^0-9]/g, '')

            return normalize
        }

        return trim
    }

    async formatPhones(p1, p2) {
        // Remove Null
        const a = p1.filter(result => result.numeroLinha !== null)
        const b = p2.filter(result => result.numeroLinha !== null)

        // Remove Telefones Duplicados
        const mergePhones = [...a, ...b]

        if (mergePhones.length > 0) {
            const filteredArray = mergePhones.reduce((acc, obj) => {
                const existingObj = acc.find((o) => o.numeroLinha === obj.numeroLinha);

                if (!existingObj) {
                    acc.push(obj);
                } else {
                    if (obj.origem === 'lmt') {
                        const index = acc.indexOf(existingObj);
                        acc[index] = obj;
                    }

                    if (obj.origem === 'black') {
                        const index = acc.indexOf(existingObj);
                        acc[index] = obj;
                    }
                }

                return acc;
            }, []);

            filteredArray.sort((a, b) => {
                if (a.origem === 'nv' && b.origem !== 'nv') {
                    return -1; // registroA vem primeiro
                } else if (b.origem === 'nv' && a.origem !== 'nv') {
                    return 1; // registroB vem primeiro
                } else {
                    return 0; // não há diferença de ordenação
                }
            })

            filteredArray.sort((a, b) => {
                if (a.origem === 'lmt' && b.origem !== 'lmt') {
                    return -1; // registroA vem primeiro
                } else if (b.origem === 'lmt' && a.origem !== 'lmt') {
                    return 1; // registroB vem primeiro
                } else {
                    return 0; // não há diferença de ordenação
                }
            })

            filteredArray.sort((a, b) => {
                if (a.origem === 'black' && b.origem !== 'black') {
                    return -1; // registroA vem primeiro
                } else if (b.origem === 'black' && a.origem !== 'black') {
                    return 1; // registroB vem primeiro
                } else {
                    return 0; // não há diferença de ordenação
                }
            })

            return filteredArray
        }

        return []
    }

    async formatEmails(p1, p2) {
        // Remove Null
        const a = p1.filter(result => result.numeroLinha !== null)
        const b = p2.filter(result => result.numeroLinha !== null)

        // Remove Telefones Duplicados
        const mergeEmails = [...a, ...b]

        if (mergeEmails.length > 0) {
            const filteredArray = mergeEmails.reduce((acc, obj) => {
                const existingObj = acc.find((o) => o.email === obj.email);

                if (!existingObj) {
                    acc.push(obj);
                }

                return acc;
            }, []);

            return filteredArray
        }

        return []
    }

    async formatMoney(value) {
        const trim = await this.formatTrim(value)
        if (trim !== null) {
            return currency(trim, {
                separator: ',',
                decimal: '.',
                precision: 2
            }).value;
        }

        return trim
    }

    async formatInt(value) {
        const trim = await this.formatTrim(value)
        if (trim !== null) {

            return parseInt(trim);
        }

        return trim
    }

    async formatSexo(value) {
        const trim = await this.formatTrim(value)
        if (trim !== null) {
            return trim == "M" ? "MASCULINO" : trim == "F" ? "FEMININO" : 'erro';
        }

        return trim
    }

    async formatEmail(value) {
        const trim = await this.formatTrim(value)
        if (trim !== null) {
            return String(trim)
                .toLowerCase()
                .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        }

        return trim
    }

    async formatNb(value) {
        const trim = await this.formatTrim(value)
        if (trim !== null) {
            const nbOk = trim.slice(0, 10)

            return (`0000000000${nbOk}`).slice(-10)
        }

        return trim
    }

    async extractPersonExists(obj) {
        let rendaEstimada = obj.renda !== null ? obj.renda.split(' ') : null
        if (rendaEstimada !== null) {
            rendaEstimada = await this.formatUpperCase((`${rendaEstimada[0]} ATÉ ${rendaEstimada[2]}`))
        }

        return {
            dataNascimento: await this.formatDate(obj.data_nasc),
            sexo: await this.formatSexo(obj.sexo),
            nomeMae: await this.formatUpperCase(obj.nome_mae),
            renda_estimada: rendaEstimada,
            fonte_renda: await this.formatUpperCase(obj.fonte_renda),
            classe_economica: await this.formatUpperCase(obj.classe_economica),
            demografia: await this.formatUpperCase(obj.demografica),
            possivel_profissao: await this.formatUpperCase(obj.possivel_profissao),
            score: await this.formatLeaveNumbers(obj.score),
            score_faixa: await this.formatUpperCase(obj.score_faixa),
            persona_credito: await this.formatUpperCase(obj.persona_credito),
            score_digital: await this.formatUpperCase(obj.score_digital),
            propensao_pagamento: await this.formatLeaveNumbers(obj.propensao_pagamento),
            flag_veiculo: obj.flag_veiculo,
            flag_bolsa_familia: obj.flag_bolsa_familia,
            flag_obito: obj.flag_obito,
            flag_imovel: obj.flag_imovel,
            flag_fgts: obj.flag_fgts
        }
    }

    async extractPerson(obj) {
        let rendaEstimada = obj.renda !== null ? obj.renda.split(' ') : null
        if (rendaEstimada !== null) {
            rendaEstimada = await this.formatUpperCase((`${rendaEstimada[0]} ATÉ ${rendaEstimada[2]}`))
        }

        return {
            nome: await this.formatUpperCase(obj.nome),
            cpf: await this.formatCpf(obj.nu_cpf),
            dataNascimento: await this.formatDate(obj.data_nasc),
            rg: await this.formatUpperCase(obj.rg),
            nit_pis: await this.formatLeaveNumbers(obj.pis_funcionario),
            sexo: await this.formatSexo(obj.sexo),
            nomeMae: await this.formatUpperCase(obj.nome_mae),
            renda_estimada: rendaEstimada,
            fonte_renda: await this.formatUpperCase(obj.fonte_renda),
            classe_economica: await this.formatUpperCase(obj.classe_economica),
            demografia: await this.formatUpperCase(obj.demografica),
            possivel_profissao: await this.formatUpperCase(obj.possivel_profissao),
            score: await this.formatLeaveNumbers(obj.score),
            score_faixa: await this.formatUpperCase(obj.score_faixa),
            persona_credito: await this.formatUpperCase(obj.persona_credito),
            score_digital: await this.formatUpperCase(obj.score_digital),
            propensao_pagamento: await this.formatLeaveNumbers(obj.propensao_pagamento),
            flag_veiculo: obj.flag_veiculo == '1' ? true : false,
            flag_bolsa_familia: obj.flag_bolsa_familia == '1' ? true : false,
            flag_obito: obj.flag_obito == '1' ? true : false,
            flag_imovel: obj.flag_imovel == '1' ? true : false,
            flag_fgts: obj.flag_fgts == '1' ? true : false
        }
    }

    async extractAddress(obj) {
        if (!!obj && obj.length && obj !== null) {
            const newArr = new Array();

            for (const end of obj) {
                if (end.cep !== null && end.lograd !== null && end.bairro !== null && end.cidade !== null && end.uf !== null) {
                    newArr.push({
                        cep: await this.formatCep(end.cep),
                        endereco: end.tp_log !== null ? await this.formatUpperCase(`${end.tp_log} ${end.lograd}`) : await this.formatUpperCase(end.lograd),
                        numero: await this.formatUpperCase(end.numero),
                        complemento: await this.formatUpperCase(end.comple),
                        bairro: await this.formatUpperCase(end.bairro),
                        cidade: await this.formatUpperCase(end.cidade),
                        uf: await this.formatUpperCase(end.uf)
                    })
                }
            }

            const uniqAddress = await newArr.filter(function (a) {
                return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
            }, Object.create(null))

            return uniqAddress
        }

        return []
    }

    async formatUniqArray(array) {
        if (!!array && array.length && array !== null) {
            const uniqAddress = await array.filter(function (a) {
                return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
            }, Object.create(null))

            return uniqAddress
        }

        return []
    }

    async extractEmpregador(obj) {
        // const resultCbo = await crud.getCbo(obj.cbo)

        let cbo = {
            codigo: null,
            descricao: null
        }

        // if (resultCbo.length > 0) {
        //     cbo = {
        //         codigo: resultCbo[0].codigo,
        //         descricao: resultCbo[0].descricao
        //     }
        // }

        return {
            tipoInscricao: "CNPJ",
            numeroInscricao: await this.formatCnpj(obj.cnpj_vinculo),
            razaoSocial: await this.formatUpperCase(obj.razao_vinculo),
            cnae1: await this.formatLeaveNumbers(obj.cnae_empregador),
            cnae2: null,
            dataAdmissao: null,
            dataDesligamento: null,
            cbo: {
                ...cbo
            },
            salario: await this.formatMoney(0),
            saldoFgts: await this.formatMoney(obj.valor_presumido)
        }
    }

    async extractTomador(obj) {
        return {
            codigo: '389',
            nome: 'Banco Mercantil Do Brasil S.A.'
        }
    }

    async extractDadosBancarios(obj) {
        return {
            banco: {
                codigo: null,
                tipo: null,
                numero: null,
                nome: null
            },
            agencia: {
                codigo: null,
                nome: null,
                endereco: {
                    cep: null,
                    endereco: null,
                    bairro: null,
                    cidade: null,
                    uf: null
                },
                orgaoPagador: null
            }
        }
    }


    async extractPhonesVivoPos(contacts) {
        const newArr = new Array();

        for (const c of contacts) {
            if (!!c.ddd && c.ddd !== null && !!c.tel && c.tel !== null) {
                newArr.push({
                    numeroLinha: await this.formatLeaveNumbers(`${c.ddd}${c.tel}`),
                    tipo: 'CELULAR',
                    whatsapp: null,
                    blacklist: null,
                    fone_nota: null,
                    classificacao: null,
                    origem: 'vivopos'
                })
            }
        }

        return newArr
    }

    async extractEmails(contact) {
        const newArr = new Array();

        if (!!contact.email1 && contact.email1 !== null) {
            const fmtEmail1 = await this.formatEmail(contact.email1);
            if (fmtEmail1 !== null) {
                newArr.push({
                    email: fmtEmail1[0]
                })
            }
        }

        if (!!contact.email2 && contact.email2 !== null) {
            const fmtEmail2 = await this.formatEmail(contact.email2);
            if (fmtEmail2 !== null) {
                newArr.push({
                    email: fmtEmail2[0]
                })
            }
        }

        if (!!contact.email3 && contact.email3 !== null) {
            const fmtEmail3 = await this.formatEmail(contact.email3);
            if (fmtEmail3 !== null) {
                newArr.push({
                    email: fmtEmail3[0]
                })
            }
        }

        return newArr
    }

    async uniqBeneficios(obj) {
        const arrBens = await obj.map(item => item.nb)
        const uniqArrBens = [...new Set(arrBens)]

        return uniqArrBens
    }

    async formatRubricas(obj) {
        const rubricas = {
            contratosEmprestimo: [],
            contratosRmc: [],
            contratosRcc: []
        }

        for (const rub of obj) {
            if (rub.tipo_empres != '76') {
                const empresimo = await this.extractEmprestimo(rub)

                rubricas.contratosEmprestimo.push(empresimo)
            } else {
                const cartao = await this.extractCartao(rub)

                rubricas.contratosRmc.push(cartao)
            }
        }

        return rubricas
    }

    async extractEmprestimo(obj) {
        if (obj.tipo_empres == '98') {
            const valorParcela = await this.formatMoney(obj.vl_parcela)
            const prazo = await this.formatInt(obj.quant_parcelas)

            const hoje = moment(new Date())
            const dateA = moment([hoje.get('year'), hoje.get('month'), hoje.get('date')])
            const dateIni = moment(obj.comp_ini_desconto + '01')
            const dateB = moment([dateIni.get('year'), dateIni.get('month'), dateIni.get('date')])

            const parcelasPagas = dateA.diff(dateB, 'month')
            const parcelasEmAberto = (prazo - parcelasPagas)
            const saldoDevedor = (parcelasEmAberto * valorParcela)

            return {
                contrato: await this.formatUpperCase(obj.id_contrato_empres),
                tipoEmprestimo: {
                    codigo: await this.formatLeaveNumbers(obj.tipo_empres),
                    descricao: 'EMPRESTIMO'
                },
                banco: {
                    codigo: await this.formatLeaveNumbers(obj.id_banco_empres),
                    nome: null
                },
                dataInicioContrato: await this.formatDate(obj.dt_averbacao_consig),
                competenciaInicioDesconto: await this.formatDate(`${obj.comp_ini_desconto}01`),
                competenciaFimDesconto: await this.formatDate(`${obj.comp_fim_desconto}01`),
                dataInclusao: await this.formatDate(obj.dt_averbacao_consig),
                situacao: "ATIVO",
                excluidoAps: null,
                excluidoBanco: null,
                valorEmprestado: await this.formatMoney(obj.vl_empres),
                valorParcela: valorParcela,
                quantidadeParcelas: prazo,
                quantidadeParcelasEmAberto: await this.formatInt(parcelasEmAberto),
                quantidadeParcelasPagas: await this.formatInt(parcelasPagas),
                saldoQuitacao: await this.formatMoney(saldoDevedor),
                taxa: await this.formatMoney(obj.taxa_empres)
            }
        }
    }

    async extractCartao(obj) {
        if (obj.tipo_empres == '76') {
            return {
                contrato: await this.formatUpperCase(obj.id_contrato_empres),
                tipoEmprestimo: {
                    codigo: await this.formatLeaveNumbers(obj.tipo_empres),
                    descricao: 'RESERVA DE MARGEM PARA CARTÃO (RMC)'
                },
                banco: {
                    codigo: await this.formatLeaveNumbers(obj.id_banco_empres),
                    nome: null
                },
                dataInicioContrato: await this.formatDate(obj.dt_averbacao_consig),
                dataInclusao: await this.formatDate(obj.dt_averbacao_consig),
                situacao: "Ativo",
                excluidoAps: null,
                excluidoBanco: null,
                limiteCartao: await this.formatMoney(obj.vl_empres),
                valorReservado: await this.formatMoney(obj.vl_parcela)
            }
        }
    }

    async calcMargemLivre(obj, renda) {
        const margemTotal = (renda * 0.35) // 35% do Salário Ex: R$1.0000 * 35% = Pode fazer emprestimo de parcela até R$350,00 de parcela
        const margemComprometida = await obj.reduce((accum, curr) => accum + curr.valorParcela, 0);
        const margemLivre = (margemTotal - margemComprometida)

        return margemLivre
    }

    async extractBeneficio(obj, r) {
        const renda = await this.formatMoney(obj.novo_beneficio)
        const margemLivre = await this.calcMargemLivre(r.contratosEmprestimo, renda)
        const margemCartoes = await this.formatMoney((renda * 0.05))
        const meioPagamento = obj.cs_meio_pagto == '1' ? 'CARTÃO MAGNETICO' : obj.cs_meio_pagto == '2' ? 'CONTA CORRENTE' : null

        return {
            nb: await this.formatNb(obj.nb),
            especie: {
                codigo: await this.formatLeaveNumbers(obj.esp),
                descricao: null
            },
            dadosBancarios: {
                banco: {
                    codigo: await this.formatLeaveNumbers(obj.id_banco_pagto),
                    tipo: meioPagamento,
                    numero: await this.formatUpperCase(obj.nu_conta_corrente),
                    nome: null
                },
                agencia: {
                    codigo: await this.formatLeaveNumbers(obj.id_agencia_banco),
                    nome: null,
                    endereco: {
                        endereco: null,
                        bairro: null,
                        cidade: null,
                        cep: null,
                        uf: null
                    },
                    orgaoPagador: null
                }
            },
            dib: await this.formatDate(obj.dib),
            ddb: await this.formatDate(obj.ddb),
            valorBeneficio: renda,
            situacaoBeneficio: 'ATIVO',
            possuiRepresentanteLegalProcurador: null,
            pensaoAlimenticia: null,
            bloqueioEmprestismo: null,
            beneficioPermiteEmprestimo: null,
            margem: {
                baseCalculoMargemConsignavel: renda,
                margemDisponivelEmprestimo: await this.formatMoney(margemLivre),
                margemDisponivelRmc: r.contratosRmc > 0 ? 0 : margemCartoes,
                margemDisponivelRcc: r.contratosRcc > 0 ? 0 : margemCartoes,
                update_at: moment(new Date()).format('YYYY-MM-DD')
            }
        }
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = new helpersClass()