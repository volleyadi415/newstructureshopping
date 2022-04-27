"use strict";

// IMPORTS ==================================================================================================
const { Pool } = require('pg')
const pool = new Pool({
    user: 'postgres',
    password: '2580',
    database: 'shopping mall',
    host: 'localhost',
    port: '5000',
})

// pool.connect(()=>{
//     console.log(" connection done")
// })

class Connection {
	async connect() {
		this.client = await pool.connect();
	}

	release() {
		this.client.release();
	}

	async begin() {
		await this.client.query("BEGIN");
	}

	async commit() {
		await this.client.query("COMMIT");
	}

	async rollback() {
		await this.client.query("ROLLBACK");
	}

	async execute(query) {
		return this.client.query(query);
	}
}
module.exports = Connection;