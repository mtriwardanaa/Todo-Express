import dotenv from 'dotenv'

dotenv.config()

const {
    PORT,
    APP_MODE,
    DB_TYPE,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    SALT_ROUND,
    TOKEN_SECRET,
    BCRYPT_PASS,
} = process.env

export default {
    appPort: PORT || 8080,
    appMode: APP_MODE,
    dbType: DB_TYPE || 'postgres',
    dbHost: DB_HOST,
    dbPort: DB_PORT || 5432,
    dbUser: DB_USER,
    dbPass: DB_PASSWORD,
    dbName: DB_NAME,
    saltRound: SALT_ROUND,
    tokenSecret: TOKEN_SECRET,
    bcPass: BCRYPT_PASS,
}
