/**
 * Used by pm2
 */

module.exports = {
    apps: [
        {
            name: "ts_purple",
            script: "app.js",
            log_date_format: "YYYY-MM-DD HH:mm Z",
            max_memory_restart: "800M",
            autorestart: false,
        },
        {
            name: "ts_testnet",
            script: "app.js",
            log_date_format: "YYYY-MM-DD HH:mm Z",
            max_memory_restart: "800M",
            autorestart: true,
        }, {
            name: "ts_prod",
            script: "app.js",
            log_date_format: "YYYY-MM-DD HH:mm Z",
            max_memory_restart: "800M",
            autorestart: true,
        }
    ]
}
