import fsPromise from "fs/promises"
import path from 'node:path'
import { format } from "date-fns"


const rootdir = path.dirname(process.argv[1])
const date = format(new Date(),'MM/dd/yyyy hh:mm:ss aaaa')
export const logDate = async (req, res, next) => {
    const eventLog = `${date}\t${req.method}\t${req.url} \n`
    await fsPromise.appendFile(path.join(rootdir, 'logs', 'EventLogs.txt'), eventLog,() => {
        if (err) throw err
    })
    

    next()
}

