import Axios from 'axios'
import { NextFunction } from 'express'
import TransportStream from 'winston-transport'

export class MyTransport extends TransportStream {
    constructor(option: TransportStream.TransportStreamOptions) {
        super(option)
    }

    log(info: any, next: NextFunction) {
        const msg = `${new Date()} : ${info.level} - ${info.message}`
        Axios.post(
            'https://hooks.slack.com/services/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',
            {
                text: msg,
            }
        )
            .then(function (response) {
                console.log(response)
            })
            .catch(function (error) {
                console.log(error)
            })
    }
}
