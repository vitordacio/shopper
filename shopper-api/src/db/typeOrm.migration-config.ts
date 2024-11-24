import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: +process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'shopper',
  entities: [__dirname + '/entities/**.ts'],
  migrations: [__dirname + '/migrations/**.ts'],
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
