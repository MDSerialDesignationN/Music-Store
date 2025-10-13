const mysql = require("mysql2/promise");

/**
 * DatabaseManager Class
 *
 * Centralized database operations manager for MySQL using mysql2.
 * Provides a unified interface for common CRUD operations across all entities.
 *
 * Features:
 * - Connection pool management
 * - Generic CRUD operations
 * - Error handling and logging
 * - Consistent API for all database interactions
 */
class DatabaseManager {
  constructor() {
    this.pool = null;
  }

  /**
   * Connect to MySQL database
   * @param {Object} config - MySQL connection configuration
   * @throws {Error} If connection fails
   */
  async connect(config) {
    try {
      this.pool = mysql.createPool({
        host: config.host || "localhost",
        user: config.user || "root",
        password: config.password || "",
        database: config.database || "musicstore",
        port: config.port || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      // Test the connection
      const connection = await this.pool.getConnection();
      connection.release();
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection error:", error);
      throw error;
    }
  }

  /**
   * Disconnect from MySQL database
   * @throws {Error} If disconnection fails
   */
  async disconnect() {
    try {
      if (this.pool) {
        await this.pool.end();
        console.log("Database disconnected successfully");
      }
    } catch (error) {
      console.error("Database disconnection error:", error);
      throw error;
    }
  }

  /**
   * Execute a SQL query
   * @param {string} sql - SQL query string
   * @param {Array} params - Query parameters
   * @returns {Promise<Array>} Query results
   * @throws {Error} If query fails
   */
  async query(sql, params = []) {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  }

  /**
   * Create a new database entry
   * @param {string} table - Table name
   * @param {Object} data - Data to insert
   * @returns {Promise<Object>} Created entry with insertId
   * @throws {Error} If creation fails
   */
  async createEntry(table, data) {
    try {
      const columns = Object.keys(data).join(", ");
      const placeholders = Object.keys(data)
        .map(() => "?")
        .join(", ");
      const values = Object.values(data);

      const sql = `INSERT INTO \`${table}\` (${columns}) VALUES (${placeholders})`;
      const result = await this.query(sql, values);

      return { insertId: result.insertId, affectedRows: result.affectedRows };
    } catch (error) {
      console.error("Error creating entry:", error);
      throw error;
    }
  }

  /**
   * Find database entries matching conditions
   * @param {string} table - Table name
   * @param {Object} conditions - WHERE conditions
   * @param {Object} options - Additional options (joins, orderBy, limit)
   * @returns {Promise<Array>} Array of matching entries
   * @throws {Error} If search fails
   */
  async findEntries(table, conditions = {}, options = {}) {
    try {
      let sql = `SELECT * FROM \`${table}\``;
      const params = [];

      // Add JOINs if specified
      if (options.joins) {
        sql += ` ${options.joins}`;
      }

      // Add WHERE conditions
      if (Object.keys(conditions).length > 0) {
        const whereClause = Object.keys(conditions)
          .map((key) => `${key} = ?`)
          .join(" AND ");
        sql += ` WHERE ${whereClause}`;
        params.push(...Object.values(conditions));
      }

      // Add ORDER BY if specified
      if (options.orderBy) {
        sql += ` ORDER BY ${options.orderBy}`;
      }

      // Add LIMIT if specified
      if (options.limit) {
        sql += ` LIMIT ${options.limit}`;
      }

      return await this.query(sql, params);
    } catch (error) {
      console.error("Error finding entries:", error);
      throw error;
    }
  }

  /**
   * Update a database entry
   * @param {string} table - Table name
   * @param {Object} conditions - WHERE conditions
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Update result
   * @throws {Error} If update fails
   */
  async updateEntry(table, conditions, updateData) {
    try {
      const setClause = Object.keys(updateData)
        .map((key) => `${key} = ?`)
        .join(", ");

      const whereClause = Object.keys(conditions)
        .map((key) => `${key} = ?`)
        .join(" AND ");

      const sql = `UPDATE \`${table}\` SET ${setClause} WHERE ${whereClause}`;
      const params = [
        ...Object.values(updateData),
        ...Object.values(conditions),
      ];

      const result = await this.query(sql, params);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      console.error("Error updating entry:", error);
      throw error;
    }
  }

  /**
   * Delete a database entry
   * @param {string} table - Table name
   * @param {Object} conditions - WHERE conditions
   * @returns {Promise<Object>} Deletion result
   * @throws {Error} If deletion fails
   */
  async deleteEntry(table, conditions) {
    try {
      const whereClause = Object.keys(conditions)
        .map((key) => `${key} = ?`)
        .join(" AND ");

      const sql = `DELETE FROM \`${table}\` WHERE ${whereClause}`;
      const params = Object.values(conditions);

      const result = await this.query(sql, params);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      console.error("Error deleting entry:", error);
      throw error;
    }
  }
}

// Export singleton instance to ensure consistent database connection across the app
module.exports = new DatabaseManager();
