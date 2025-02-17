# email-forwarder
Notifications within dannyshih.net use email. While ancient, email is still the most ubiquitous notification mechanism. In a *nix system, once `mailx` is configured, a bunch of stuff (smartd, mdmonitor, ZFS ZED, etc) automatically gets email support. Also, all self-host projects (Nextcloud, Bitwarden, Wordpress) support email.

However, email has long since fallen out of favor as the final point of notification. Push-based app notifications and chat tools like Slack are generally preferred.

This project implements a barebones Nodejs SMTP server to serve as a central point for all those services to aim emails at. The SMTP server is accessible everywhere within dannyshih.net on Port 25 with no auth, so configuration is as simple as it gets. Once received, emails are forwarded to an external notification service, currently Slack. This makes it easy to switch to another notification service, say if Slack decides to gut its free tier. Also, even if I choose to go with something like Gmail, this avoids needing to configure SMTP authentication (a pain) for every service.

Note that Opensearch dashboards does not send alerts to this `email-forwarder`, opting instead to send to Slack directly. This could have gone either way, but the support was there (and is one of the reasons I switched to Opensearch from Elasticsearch). Also, this has the advantage of notifying me if `email-forwarder` fails to send emails, since it will log an error which will eventually become an alert!

A fully-fledged email server (postfix, dovecot) is not really necessary, because there's no person-to-person communication going on. It is all system-to-admin communication, so I prefer to run a Nodejs app.
