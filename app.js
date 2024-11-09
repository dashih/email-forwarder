'use strict';

const fs = require('fs');
const SMTPServer = require('smtp-server').SMTPServer;
const simpleParser = require('mailparser').simpleParser;
const { Client } = require('@elastic/elasticsearch');
const { WebClient } = require('@slack/web-api');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const slackToken = config.slackToken;

const esClient = new Client({
    node: 'http://elasticsearch:9200'
});
const unsentSlacksIndex = 'unsent-slacks';

const slackClient = new WebClient(slackToken);
const slackChannel = '#alerts-and-notifications';

const healthcheckHost = '"Healthcheck" <healthcheck@localhost>';
const bitwardenAdminLinkPrefix = 'bitwarden.dannyshih.net/admin/login/confirm';

const server = new SMTPServer({
    disabledCommands: ['AUTH'],
    async onData(stream, session, callback) {
        const msgJson = await simpleParser(stream);
        const host = msgJson.to.text;
        if (host === healthcheckHost) {
            callback(null);
            return;
        }

        const subject = msgJson['subject'];
        const msg = msgJson['text'];
        if (msg.indexOf(bitwardenAdminLinkPrefix) !== -1) {
            console.log('bitwarden admin link detected. writing to /bitwarden-admin/mail.log instead of slacking');
            await fs.promises.writeFile('/bitwarden-admin/mail.log', msg);
            callback(null);
            return;
        }

        try {
            const fullMsg = `${':email: '.repeat(4)}\n*${subject}*\n${host}\n\n${msg}`;
            console.log(`${fullMsg}\n${'-'.repeat(80)}\n`);
            await slackClient.chat.postMessage({
                channel: slackChannel,
                text: fullMsg
            });
        } catch (err) {
            console.error(err);
            await esClient.index({
                index: unsentSlacksIndex,
                body: {
                    host: host,
                    subject: subject,
                    message: msg
                }
            });
        } finally {
            callback(null);
        }
    }
});

server.on('error', err => {
    console.error(err);
});

server.listen(25, () => {
    console.log('server is listening on port 25');
});
