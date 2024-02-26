const knex = require('../conn/knex_config');

class crud {
    async leadExists(obj, table) {
        try {
            const leadId = await knex.smartDbConsig.from(table).where({
                document: obj.document,
            }).select('id');
            return leadId[0].id
        } catch (error) {
            return false
        }
    }

    async insertLead(obj, table) {
        try {
            await knex.smartDbConsig.from(table).insert(obj);
        } catch (error) {
            return false
        }
    }

    async updateLead(obj, table, leadId) {
        try {
            await knex.smartDbConsig.from(table).where({ id: leadId }).update(obj);
            // await knex.smartDbConsig.raw(`DELETE FROM movimentacao WHERE servico='INICIAL'`)
        } catch (error) {
            console.error('Erro ao ler o arquivo CSV:', error);
        }
    }

    async contactExists(obj, table) {
        try {
            const contactId = await knex.smartDbConsig.from(table).where('contact', obj.contact).select('id');

            return contactId[0].id
        } catch (error) {
            return false
        }
    }

    async insertContact(obj, table) {
        try {
            await knex.smartDbConsig.from(table).insert(obj);
        } catch (error) {
            return false
        }
    }

    async updateContact(obj, table, contactId) {
        try {
            await knex.smartDbConsig.from(table).where({ id: contactId }).update(obj);
        } catch (error) {
            console.error('Erro ao ler o arquivo CSV:', error);
        }
    }
}


module.exports = new crud();