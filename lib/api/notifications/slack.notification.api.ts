import { Config } from "../../config/config";

export class SlackNotificationAPI {
    config: Config;
    
    constructor() {
        this.config = new Config();
    }
    
    sendSlackMessage(message, level) {
        if (level === "Fatal") {
            return this.sendFatalMessage(message);
        } else {
            // Level === Error
            return this.sendErrorMessage(message);
        }
    }

    async sendErrorMessage(logInfo) {
        const axios = require('axios'); 
        var webhook = this.config.slackWebhook;

        var className : string = logInfo.class_name;
        var functionName: string = logInfo.function_name;
        var shortText: string = logInfo.short_text;
        var description: string = logInfo.description;
        var timestamp: string = logInfo.timestamp;

        var message: string = "*Class* : " + className + 
                                "\n*Function Name :* " + functionName +
                                "\n*Error :* " + shortText +
                                "\n*Description* : " + description +
                                "\n\n*Timestamp* : " + timestamp;

        var icon = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/twitter/154/warning-sign_26a0.png";
        var color = "#ffa149";

        await axios.post(webhook, {
            attachments: [
                {
                    "mrkdwn": true,
                    "fallback": message,
                    "color": color,
                    "title": "TaskServer - Error",
                    "text": message,
                    "thumb_url": icon
                }
            ]
        }).then(response => {
            return true;
        }).catch(() => {
            return false;
        });
    }

    async sendFatalMessage(logInfo) {
        const axios = require('axios');
        var webhook = this.config.slackWebhook;

        var className: string = logInfo.class_name;
        var functionName: string = logInfo.function_name;
        var shortText: string = logInfo.short_text;
        var description: string = logInfo.description;
        var timestamp: string = logInfo.timestamp;

        var message: string = "*Class* : " + className +
                            "\n*Function Name :* " + functionName +
                            "\n*Error :* " + shortText +
                            "\n*Description* : " + description +
                            "\n\n*Timestamp* : " + timestamp;
        
        var icon = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/twitter/154/double-exclamation-mark_203c.png";
        var color = "#ff0000";

        await axios.post(webhook, {
            attachments: [
                {
                    "fallback": message,
                    "color": color,
                    "title": "TaskServer - Fatal Error",
                    "text": message,
                    "thumb_url": icon
                }
            ]
        }).then(response => {
            return true;
        }).catch(() => {
            return false;
        });
    }

    async sendGenericMessage(logInfo) {
        const axios = require('axios');
        var webhook = this.config.slackWebhook;

        var className: string = logInfo.class_name;
        var functionName: string = logInfo.function_name;
        var shortText: string = logInfo.short_text;
        var description: string = logInfo.description;
        var timestamp: string = logInfo.timestamp;

        var message: string = "*Class* : " + className +
            "\n*Function Name :* " + functionName +
            "\n*Error :* " + shortText +
            "\n*Description* : " + description +
            "\n\n*Timestamp* : " + timestamp;

        await axios.post(webhook, {
            attachments: [
                {
                    "fallback": message,
                    "title": "TaskServer",
                    "text": message,
                }
            ]
        }).then(response => {
            return true;
        }).catch(() => {
            return false;
        });
    }
}