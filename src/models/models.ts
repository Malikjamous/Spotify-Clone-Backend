import * as fs from 'fs';
import * as path from 'path';
import { Sequelize } from 'sequelize';

const basename = path.basename(module.filename);
const db: any = {};

if (!process.env.DB_DATABASE) {
  throw new Error("Environment variable 'DB_DATABASE' must be set.");
}
if (!process.env.DB_HOSTNAME) {
  throw new Error("Environment variable 'DB_HOSTNAME' must be set.");
}
if (!process.env.DB_USERNAME) {
  throw new Error("Environment variable 'DB_USERNAME' must be set.");
}
if (!process.env.DB_PASSWORD) {
  throw new Error("Environment variable 'DB_PASSWORD' must be set.");
}

const DB_DATABASE = process.env.DB_DATABASE;
const DB_HOSTNAME = process.env.DB_HOSTNAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DIALECT = process.env.DB_DIALECT || 'mysql';
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_LOGGING = process.env.DB_LOGGING === 'true';

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  dialect: DB_DIALECT,
  host: DB_HOSTNAME,
  port: DB_PORT,
  define: { charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' },
  logging: DB_LOGGING,
  operatorsAliases: false,
  pool: {
    min: 1,
    max: 100,
    acquire: 5000,
  },
});

fs.readdirSync(__dirname)
  .filter((file: any) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file !== 'index.ts' &&
      file !== 'models.types.ts' &&
      (file.slice(-3) === '.js' || file.slice(-3) === '.ts')
    );
  })
  .forEach((file: any) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName: any) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.transaction = sequelize.transaction.bind(db.sequelize);

module.exports = db;
