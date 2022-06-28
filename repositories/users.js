const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
    //acessando o arquivo do banco de dados no HD
    constructor(filename) {
        if (!filename) {
            throw new Error('Para criar um repositorio precisamos de um nome de arquivo!');
        }

        this.filename = filename;
        try {
        fs.accessSync(this.filename);
        } catch (err){
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async getAll() {
        return JSON.parse(await fs.promises.readFile(this.filename, { 
            encoding: 'utf8' 
            })
        );        
    }

    async create(attrs) {
        attrs.id = this.randomId();

        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.password, salt, 64);

        const records = await this.getAll();
        const record = {
            ...attrs,
            password: `${buf.toString('hex')}.${salt}`
        };        
        records.push(record);

        await this.writeAll(records);

        return record;
    }

    async comparePasswords(saved, supplied) {
        //saved: password salvo no banco de dados no formato "hashed.salt"
        //supplied: password fornecido pelo usuario tentando logar no sistema
        const result = saved.split('.');
        const hashed = result[0];
        const salt = result[1];

        //tem o mesmo efeito das 3 linhas acima: const [hashed, salt] = saved.split('.');

        const hashedSuppliedBuffer = await scrypt(supplied, salt, 64);

        return hashed === hashedSuppliedBuffer.toString('hex'); //retorna apenas se forem iguais
    }

    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2)); //o segundo e terceiro argumento formatam os valores
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update (id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);

        if (!record) {
            throw new Error(`Registro com id ${id} não existe`);
        }

        Object.assign(record, attrs); //atualiza o objeto record com os valores de attrs
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        const records = await this.getAll();

        for (let record of records) {
            let found = true;

            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }
            if (found) {
                return record;
            }
        }
    }
}

module.exports = new UsersRepository('users.json'); //exporta uma instancia desta classe