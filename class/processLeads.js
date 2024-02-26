const fs = require('fs');
const readline = require('readline');
const path = require('path');
const crud = require("./db_crud")
const helpers = require('../helpers/helpers');
const db = require('../conn/knex_config');

class processLeads {
    async execute(csvFilePath, instances) {
        const smsMsg = await db.smartDbConsig.from('msg_sms').where('status', 'active').select('sms_msg').limit(1)

        const dataSMS = []
        const dataUraReversa = []

        const fileStream = fs.createReadStream(csvFilePath, { encoding: 'utf-8' });
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });

        let header = null;

        let g = 0;
        for await (const line of rl) {
            if (!header) {
                header = true;
            } else {
                const columns = line.split(';');
                let name = await helpers.returnFirstName(columns[1])
                const documentFmt = await helpers.formatCpf(columns[0])
                let pushData = true;

                const find = await db.smartDbConsig.from('leads').where('document', documentFmt);
                if (find.length > 0 && find[0].last_activitie_type !== null) {
                    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
                    console.log('esse cara já esta em tratamento')
                    pushData = false;
                }

                const contacts = [
                    {
                        document: documentFmt,
                        contact: columns[2],
                        hash_contact: await helpers.generateUniqueHash(6),
                        banco: columns[7] ? columns[7] : ''
                    }
                ]
                for (const item of contacts) {
                    if (item.contact && item.contact != null) {
                        if (item.blacklist !== 0) {
                            let hash = item.hash_contact;

                            const consultContact = await db.smartDbConsig.from('contacts').where('contact', item.contact);

                            if (consultContact && consultContact.length > 0) {
                                hash = consultContact[0].hash_contact;
                            }


                            const msgSMS = smsMsg[0].sms_msg.replaceAll('[NOME]', name.name).replaceAll('[BANCO]', item.banco)
                            if (pushData) {
                                const rowDataPacket = instances[g % instances.length];
                                dataSMS.push({
                                    numero: item.contact,
                                    mensagem: msgSMS,
                                    link: `gsms.cc/1/${hash}-1-${rowDataPacket.id}`
                                })
                                g++;
                            }
                        }

                        await this.executeContact(item, 'contacts')
                    }
                }

                const obj = {
                    document: documentFmt,
                    first_name: name.name,
                    last_name: name.lastName,
                    contato1: columns[2],
                    data_nascimento: await helpers.formatDate(columns[3]),
                    banco: columns[4] ? await helpers.formatBank(columns[4]) : '',
                    agencia_liberada: columns[5] ? columns[5] : '',
                    conta: columns[6] ? columns[6] : ''

                };

                if (pushData) {
                    dataUraReversa.push(obj)
                }
                await this.executeLeads(obj, 'leads')
            }
        }

        await this.createSMSCsv(dataSMS)
        await this.createUraReversaCsv(dataUraReversa)
    }

    async executeContact(obj, tabela) {
        delete obj.banco
        // console.log(`\nEnviado para o banco de dados Contato: ${obj.contact}`.bgRed.black);

        let contactId = await crud.contactExists(obj, tabela)
        // console.log(contactId);
        if (!contactId) {
            contactId = await crud.insertContact(obj, tabela)
            console.log(`Contato: ${obj.contact} CRIADO!`.bgGreen.black);
        } else {
            delete obj.hash_contact
            await crud.updateContact(obj, tabela, contactId)
            console.log(`Lead CPF: ${obj.contact} ATUALIZADO!`.bgMagenta.black);
        }

    }

    async executeLeads(obj, tabela) {
        // console.log(obj)
        // console.log(`\nEnviado para o banco de dados CPF: ${obj.document}`.bgCyan.black);

        let leadId = await crud.leadExists(obj, tabela)
        // console.log(leadId);
        if (!leadId) {
            leadId = await crud.insertLead(obj, tabela)
            // console.log(`Lead CPF: ${obj.document} CRIADO!`.bgGreen.black);
        } else {
            await crud.updateLead(obj, tabela, leadId)
            // console.log(`Lead CPF: ${obj.document} ATUALIZADO!`.bgMagenta.black);
        }
    }

    async splitCsv(inputFilePath, outputFolderPath, batchSize) {
        // Ler o arquivo CSV
        const data = fs.readFileSync(inputFilePath, 'utf-8')

        // Dividir as linhas
        const lines = data.split('\n')

        // Obter o cabeçalho
        const header = lines.shift()

        // Dividir em partes
        const batches = [];
        for (let i = 0; i < lines.length; i += batchSize) {
            const batch = [header, ...lines.slice(i, i + batchSize)];
            batches.push(batch);
        }

        // Salvar cada parte em um novo arquivo
        batches.forEach((batch, index) => {
            const outputFilePath = `${outputFolderPath}/part_${index + 1}.csv`;
            const outputData = batch.join('\n');
            fs.writeFileSync(outputFilePath, outputData);
        });

        console.log(`Arquivo dividido em ${batches.length} partes.`)

        return batches;
    }

    async createSMSCsv(data) {
        const FileName = `lista_sms.csv`;
        const outputFilePath = path.join(__dirname, '..', 'csv_sms', FileName);

        // Cabeçalho
        const header = 'numero;mensagem;link';

        let csvContent;
        if (fs.existsSync(outputFilePath)) {
            const existingContent = fs.readFileSync(outputFilePath, 'utf-8');
            const existingLines = existingContent.split('\n').slice(1); // Excluir o cabeçalho existente

            const newLines = [];
            for (const columns of data) {
                const line = `${columns.numero};${columns.mensagem};${columns.link}`;
                newLines.push(line);
            }

            csvContent = [header, ...existingLines, ...newLines].join('\n');
        } else {
            const newLines = [];
            for (const columns of data) {
                const line = `${columns.numero};${columns.mensagem};${columns.link}`;
                newLines.push(line);
            }

            csvContent = [header, ...newLines].join('\n');
        }

        fs.writeFileSync(outputFilePath, csvContent);

        console.log(`Arquivo Para ### SMS Gerado ### com sucesso`.cyan);
    }

    async createUraReversaCsv(data) {
        const FileName = `lista_ura_reversa.csv`;
        const outputFilePath = path.join(__dirname, '..', 'csv_ura_reversa', FileName);

        // Cabeçalho
        const header = 'nome;cpf;contato1;contato2';

        let csvContent;
        if (fs.existsSync(outputFilePath)) {
            const existingContent = fs.readFileSync(outputFilePath, 'utf-8');
            const existingLines = existingContent.split('\n').slice(1); // Excluir o cabeçalho existente

            const newLines = [];
            for (const columns of data) {
                const contato1 = columns.contato1 != null ? columns.contato1 : ''
                const contato2 = columns.contato2 != null ? columns.contato2 : ''
                const line = `${columns.first_name} ${columns.last_name};${columns.document};${contato1};${contato2}`;
                newLines.push(line);
            }

            csvContent = [header, ...existingLines, ...newLines].join('\n');
        } else {
            const newLines = [];
            for (const columns of data) {
                const contato1 = columns.contato1 != null ? columns.contato1 : ''
                const contato2 = columns.contato2 != null ? columns.contato2 : ''
                const line = `${columns.first_name} ${columns.last_name};${columns.document};${contato1};${contato2}`;
                newLines.push(line);
            }
            csvContent = [header, ...newLines].join('\n');
        }

        fs.writeFileSync(outputFilePath, csvContent);

        console.log(`Arquivo Para ### Ura Reversa Gerado ### com sucesso`.cyan);
    }
}


module.exports = new processLeads();