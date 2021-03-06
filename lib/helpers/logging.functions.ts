import { Config } from "../config/config";
import { SlackNotificationAPI } from "../api/notifications/slack.notification.api";

export class LoggingFunctions {
    config : Config;
    slack: SlackNotificationAPI;

    constructor() {
        this.config = new Config();
        this.slack = new SlackNotificationAPI();
    }
    
    log_debug(class_name : string, function_name : string, short_text : string, description : string) {
        var log: any = { type: "Debug", class_name: class_name, function_name: function_name, short_text: short_text, description: description, timestamp: new Date().toString() };
        if (this.config.debug) {
            console.log(log);
        }
        return log;
    }

    log_error(class_name : string, function_name : string, short_text : string, description : string) {
        var log: any = { type: "Error", class_name: class_name, function_name: function_name, short_text: short_text, description: description, timestamp: new Date().toString() };
        console.log(log);
        this.slack.sendSlackMessage(log, log.type);
        return log;
    }

    log_fatal(class_name: string, function_name: string, short_text: string, description: string) {
        var log: any = { type: "Fatal", class_name: class_name, function_name: function_name, short_text: short_text, description: description, timestamp: new Date().toString() };
        console.log(log);
        this.slack.sendSlackMessage(log, log.type);
        return log;
    }

}