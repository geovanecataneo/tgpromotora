const fs = require('fs');
const path = require('path');
const processLeads = require("./class/processLeads")
const colors = require('colors');
const db = require('./conn/knex_config')
colors.enable();

// Parâmetros
const csvFileName = 'modelo_importacao.csv';
const inputFilePath = path.join(__dirname, csvFileName);
const outputFolderPath = path.join(__dirname, 'csv_partes');

(async () => {
    // console.log('\n****************************************************************************\n');

    const csvFileName = 'modelo_importacao.csv';
    const csvFilePath = path.join(__dirname, csvFileName);

    if (fs.existsSync(csvFilePath)) {
        const instances = await db.smartDbConsig.from('instances').where('status_sms', 'active').select('id')
        if (instances && instances.length > 0) {
            const batchSize = instances.length * 100; // Tamanho de cada parte
            const totalBots = await processLeads.splitCsv(inputFilePath, outputFolderPath, batchSize);
            console.log(`${totalBots.length}`.bgRed.yellow);

            for (let i = 0; i < totalBots.length; i++) {
                const csvPartFileName = `part_${i + 1}.csv`;
                const csvPartFilePath = path.join(__dirname, 'csv_partes', csvPartFileName);

                console.log(`bot nº${i + 1} iniciado com o arquivo ${csvPartFilePath}`.bgWhite.red)
                processLeads.execute(csvPartFilePath, instances);
            }
        } else {
            console.log('\n\n### Desculpe mais para gerar um arquivo é necessário ter pelo menos uma instancia para SMS ativa ###'.red);
        }

        console.log('\n\n### Fim do Processamento ###'.red);
    } else {
        console.log('Arquivos CSV não encontrado');
    }
})();