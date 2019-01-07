/**
 * Used by pm2
 */

module.exports = {
    apps: [
        {
            name: "ts",
            script: "dist/app.js",
            log_date_format: "YYYY-MM-DD HH:mm Z",
            max_memory_restart: "800M",
            autorestart: false,
        }
    ]
}
