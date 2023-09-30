# elk-email
ELK works great for log/metric monitoring, but many things still use email. Nextcloud and Bitwarden use email for 2FA and notifications. mdmonitor and smartd use email for immediate notification of failures. I also want to send informational emails for various things: snapshots, letsencrypt renewal, backup summaries.

A fully-fledged email server (postfix, dovecot) is not really necessary, because there's no person-to-person communication going on. It is all system-to-admin communication, so I prefer to run a barebones Node.js SMTP server that forwards to Slack (free-tier).

The only reason this lives in the ELK universe is that I use Elasticsearch to store unsent emails, in the event Slack or my Internet is down for more than 30 minutes (Slack's retry policy).

```
docker build --tag dannyshih/elk-email:<TAG> .
```
