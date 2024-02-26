const fs = require('fs');
const path = require('path');
const processLeads = require("./class/processLeads")
const colors = require('colors');
colors.enable();

// Parâmetros
const csvFileName = 'lista_zaplus.csv';
const inputFilePath = path.join(__dirname, csvFileName);
const outputFolderPath = path.join(__dirname, 'csv_partes');;
const batchSize = 100; // Tamanho de cada parte

(async () => {
    // console.log('\n****************************************************************************\n');

    const csvFileName = 'lista_zaplus.csv';
    const csvFilePath = path.join(__dirname, csvFileName);

    if (fs.existsSync(csvFilePath)) {
        const totalBots = await processLeads.splitCsv(inputFilePath, outputFolderPath, batchSize);
        // console.log(`${totalBots.length}`.bgRed.yellow);

        for (let i = 0; i < totalBots.length; i++) {
            const csvPartFileName = `part_${i + 1}.csv`;
            const csvPartFilePath = path.join(__dirname, 'csv_partes', csvPartFileName);

            // console.log(`bot nº${i + 1} iniciado com o arquivo ${csvPartFilePath}`.bgWhite.red)
            processLeads.execute(csvPartFilePath);
        }

        // console.log('\n\n### Fim do Processamento ###'.red);
    } else {
        // console.log('Arquivos CSV não encontrado');
    }
})();