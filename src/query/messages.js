class Messages {
    mysql = require('mysql2/promise')

    // TODO: Put in ENV
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
     * Get messages
     */
    async getMessages() {
        const conn = await this.createConnection()
        const [results] = await conn.execute('SELECT * FROM messages')
        return results
    }

    /**
     * Get message detail
     */
    async getMessageDetail(room_id) {
        const conn = await this.createConnection()
        const [results] = await conn.execute('SELECT * FROM messages WHERE room_id = ?', [room_id])
        return results
    }

    /**
     * Create messages
     */
    async createMessages({room_id, user_id, inbox, datetime}) {
        const conn = await this.createConnection()
        await conn.execute('INSERT INTO messages (room_id, user_id, inbox, datetime) VALUES (?, ?, ?, ?)', [room_id, user_id, inbox, datetime])
    }

   
}

module.exports = new Messages()