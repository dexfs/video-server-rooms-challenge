import { loadEnv } from './src/bootstrap/loadEnvironments';

loadEnv();

const entities = ['./src/app/entities/*.ts'];
const migrations = ['./src/database/migrations/*.ts'];
const factories = ['src/database/factories/**/*{.ts,.js}'];
const seeds = ['src/database/seeds/**/*{.ts,.js}'];

const connectionOptions = [
  {
    name: 'development',
    type: 'postgres',
    database: String(process.env.TYPEORM_DATABASE),
    host: String(process.env.TYPEORM_HOST),
    port: Number(process.env.TYPEORM_PORT),
    username: String(process.env.TYPEORM_USERNAME),
    password: String(process.env.TYPEORM_PASSWORD),
    synchronize: false,
    logging: true,
    entities,
    migrations,
    factories,
    seeds,
    cli: {
      migrationsDir: './src/database/migrations',
      entitiesDir: './src/app/entities/*.ts',
    },
    default: true
    // dropSchema: true
  },
  {
    name: 'test',
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    logging: false,
    entities,
    migrations,
    factories,
    seeds,
    dropSchema: true,
  },
];

module.exports = connectionOptions;
