import { Config, ExternalConfig } from "../config/config";

export class LoggingFunctions {
    
    log_debug(class_name : string, function_name : string, short_text : string, description : string) {
        console.log({ type: "Debug", class_name: class_name, function_name: function_name, short_text: short_text, description: description, timestamp: new Date().toString()});
    }

    log_error(class_name : string, function_name : string, short_text : string, description : string) {
        console.log({ type: "Error", class_name: class_name, function_name: function_name, short_text: short_text, description: description, timestamp: new Date().toString()});
    }

    log_fatal(class_name: string, function_name: string, short_text: string, description: string) {
        console.log({ type: "Fatal", class_name: class_name, function_name: function_name, short_text: short_text, description: description, timestamp: new Date().toString()});
    }

}