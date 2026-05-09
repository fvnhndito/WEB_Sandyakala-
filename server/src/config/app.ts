export const AppConfig = {
  DB_HOST: process.env.DB_HOST as string,
  DB_USER: process.env.DB_USER as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,
  DB_NAME: process.env.DB_NAME as string,
  DB_PORT: Number(process.env.DB_PORT) || 3306,
  JWT_SECRET: process.env.JWT_SECRET as string,
};
