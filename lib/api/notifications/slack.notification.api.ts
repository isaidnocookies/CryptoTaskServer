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
        var webhook = this.config.slackWebhooks.taskserver;

        var className : string = logInfo.class_name;
        var functionName: string = logInfo.function_name;
        var shortText: string = logInfo.short_text;
        var description: string = logInfo.description;
        var timestamp: string = logInfo.timestamp;
        // create message...

        var message: string;

        var icon = "https://emojis.slackmojis.com/emojis/images/1450319446/57/kappa.png?1450319446";
        var color = "#000066";
        // create message...

        await axios.post(webhook, {
            attachments: [
                {
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
        var webhook = this.config.slackWebhooks.taskserver;

        var className: string = logInfo.class_name;
        var functionName: string = logInfo.function_name;
        var shortText: string = logInfo.short_text;
        var description: string = logInfo.description;
        var timestamp: string = logInfo.timestamp;

        var message : string;
        
        var icon = "https://emojis.slackmojis.com/emojis/images/1464135001/460/fb-sad.gif?1464135001";
        var color = "#00cc00";
        // create message...

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
}