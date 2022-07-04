const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository.js');
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository { //importa os métodos da classe Repository
    async comparePasswords(saved, supplied) {
        const [hashed, salt] = saved.split('.'); //atribui os valores da esquerda para hashed e da direita para salt

        const hashedSuppliedBuffer = await scrypt(supplied, salt, 64);

        return hashed === hashedSuppliedBuffer.toString('hex'); //retorna true apenas se os dois hashes forem iguais
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
}

module.exports = new UsersRepository('users.json'); //exporta uma instancia desta classe