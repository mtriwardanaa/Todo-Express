import bcrypt from 'bcrypt'
import config from '../configs/config'

export const hashPass = (passwrod: string) => {
    const salt = parseInt(config.saltRound as string, 10)
    return bcrypt.hashSync(`${passwrod}${config.bcPass}`, salt)
}

export const checkHash = (password: string, hashPass: string) => {
    return bcrypt.compareSync(`${password}${config.bcPass}`, hashPass)
}
