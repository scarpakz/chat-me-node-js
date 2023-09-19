class User {
    mysql = require('mysql2/promise')

    constructor() {
        this.databaseConfig = {
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'chatme'
        }
    }

    /**
     * Establish connection.
     * @returns 
     */
    async createConnection() {
        const { host, user, password, database } = this.databaseConfig
        const conn = await this.mysql.createConnection({host: host, user: user, password: password, database: database})
        return conn
    }

    /**
     * Get all active users.
     * @returns rows
     */
    async getUsers() {
        const conn = await this.createConnection()
        const [rows] = await conn.execute('SELECT * FROM `users`')
        return rows
    }

    /**
     * Delete a specific user after sign out.
     */
    async deleteUserDetail(codename) {
        const conn = await this.createConnection()
        await conn.execute('DELETE FROM users WHERE code_name = (?)',[codename])
    }

    /**
     * Add new user
     */
    async addNewUser(codename) {
        const conn = await this.createConnection()
        await conn.execute('INSERT INTO `users` (code_name) VALUES (?)',[codename])
    }
}

module.exports = new User()