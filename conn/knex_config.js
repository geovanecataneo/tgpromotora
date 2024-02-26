const knex = require('knex');

// Base "Telefones" Nova API
const smartDbConsig = knex({
    client: 'mysql',
    connection: {
        host: '89.117.61.120',
        user: 'root',
        password: '455ttte',
        database: 'tgpromotora'
        // database: 'smart_consig_backup'
    },
    pool: {
        min: 0,
        max: 380
    }
});

module.exports = {
    smartDbConsig
}