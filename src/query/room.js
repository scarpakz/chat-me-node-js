class Room {
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
     * Get rooms
     */
    async getRooms() {
        const conn = await this.createConnection()
        const [results] = await conn.execute('SELECT * FROM room')
        return results
    }

    /**
     * Create room.
     */
    async addRoom(room_name) {
        const conn = await this.createConnection()
        await conn.execute('INSERT INTO room (name) VALUES (?)', [room_name])
    }

    /**
     * Get active room detail.
     */
    async getActiveRoomDetail(room_id) {
        const conn = await this.createConnection()
        const [results] = await conn.execute('SELECT * FROM active_room WHERE room_id = ?',[room_id])
        return results
    }

    /**
     * Create active room.
     */
    async addActiveRoom(user_id, room_id) {
        const conn = await this.createConnection()
        await conn.execute('INSERT INTO active_room (user_id, room_id) VALUES (?, ?)', [user_id, room_id])
    }

    /**
     * Delete active room.
     */
    async deleteActiveRoom(user_id) {
        const conn = await this.createConnection()
        await conn.execute('DELETE FROM active_room WHERE user_id = (?)', [user_id])
    }
}

module.exports = new Room()
