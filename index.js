import express from 'express';
import bunyan from 'bunyan';
import lb from '@google-cloud/logging-bunyan';

const isProduction = process.env.NODE_ENV === 'production';

let logOption = {
    name: 'nhanc18-log',
    streams: [
        { stream: process.stdout, level: 'info' }
    ]
};
if (isProduction) {
    logOption.streams.push(new lb.LoggingBunyan().stream('info'));
}

const logger = bunyan.createLogger(logOption);
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, world!');
    logger.info('nhanc18-log: Hello, world!');
});

app.get('/api1', (req, res) => {
    res.send('api1');
    logger.info('nhanc18-log: api1');
});

app.get('/api2', (req, res) => {
    res.send('api2');
    logger.info('nhanc18-log: api2');
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 6868;
app.listen(PORT, '0.0.0.0', () => {
    logger.info(`nhanc18-log: Server listening on port ${PORT}...`);
});