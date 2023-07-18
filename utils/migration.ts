import { connectDbAsync, db, query, connectDbMigration } from "./config/db";
import path from "path";
import dotenv from "dotenv";
// load enviroment variables...
dotenv.config({ path: path.join(__dirname, "../", "config.env") });
//interface for table object
interface tableObject {
  tableName: string;
  tableFields: Array<string>;
  primaryKey: string;
}

// add more item to databases array to create more database
const dataBases = ["lendsqr"];

// connect for DB migration
if (process.argv[2] === "--migrate-dbs") {
  connectDbMigration();
}

// create databases
if (process.argv[2] === "--migrate-dbs") {
  dataBases.forEach((database) => {
    db.query(
      `CREATE DATABASE IF NOT EXISTS ${database}`,
      (err, result, field) => {
        if (err) {
          console.log("database creation failed");
          return;
        }
        console.log(result);
      }
    );
  });
}

const tables: Array<tableObject> = [
  {
    tableName: "users",
    tableFields: [
      "id INT AUTO_INCREMENT NOT NULL UNIQUE",
      "first_name VARCHAR(255) NOT NULL",
      "last_name VARCHAR(255) NOT NULL",
      "email VARCHAR(255) NOT NULL UNIQUE ",
      "password VARCHAR(255)",
      "balance float",
      "age INT NOT NULL",
      "phone VARCHAR(255) NOT NULL UNIQUE",
      "created_at TIMESTAMP",
      "address VARCHAR(255)",
      "account_deleted binary",
      "password_reset_token VARCHAR(255)",
      "token_expiration VARCHAR(255)",
    ],
    primaryKey: "id",
  },
  {
    tableName: "transactions",
    tableFields: [
      "id INT AUTO_INCREMENT NOT NULL UNIQUE",
      "user_id INT NOT NULL",
      "account_id INT NOT NULL",
      "sender_name VARCHAR(255) NOT NULL",
      "sender_account_number VARCHAR(255)",
      "sender_account_id INT",
      "sender_id INT",
      "beneficiary_name VARCHAR(255) NOT NULL",
      "beneficiary_account_number VARCHAR(255)",
      "beneficiary_account_id INT",
      "beneficiary_id INT",
      "amount FLOAT",
      "created_at TIMESTAMP",
    ],
    primaryKey: "id",
  },
  {
    tableName: "accounts",
    tableFields: [
      "id INT AUTO_INCREMENT NOT NULL UNIQUE",
      "user_id INT NOT NULL",
      "balance FLOAT",
      "account_number VARCHAR(255) NOT NULL UNIQUE",
      "created_at TIMESTAMP",
      "account_type VARCHAR(255) NOT NULL",
      "account_holder_name VARCHAR(255) NOT NULL",
    ],
    primaryKey: "id",
  },
];

// connect to db for table migration
if (process.argv[2] === "--migrate-tbs") {
  connectDbAsync();
}
if (process.argv[2] === "--migrate-tbs") {
  tables.forEach(async (table) => {
    const result = await query(
      `CREATE TABLE IF NOT EXISTS ${table.tableName}(${table.tableFields.join(
        ", "
      )}, PRIMARY KEY(${table.primaryKey})) `
    );
    console.log(result);
  });
}

if (process.argv[2] === "--migration-rollback") {
}
