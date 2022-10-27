import connect from './configs/connect'
import config from './configs/config'
import app from './configs/app'

const PORT = config.appPort

app.listen(PORT, async () => {
    console.log(`Server running ${PORT}`)

    connect
})
