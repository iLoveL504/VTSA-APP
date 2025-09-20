import fs from "fs/promises";
import path from 'path';
import { format } from "date-fns";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, 'logs', 'EventLogs.txt');

export const logDate = async (req, res, next) => {
    try {
        // ensure logs folder exists
        await fs.mkdir(path.dirname(logFilePath), { recursive: true });

        const date = format(new Date(), 'MM/dd/yyyy hh:mm:ss aaaa');
        const eventLog = `${date}\t${req.method}\t${req.url}\n`;

        await fs.appendFile(logFilePath, eventLog);
    } catch (err) {
        console.error('🔥 Logging Error:', err);
    }

    next();
};
