module.exports = {
    app: {
        name: 'myKoajsApp',
        version: '0.1.0'
    },
    server: {
        port: 8081
    },
    "database": {
        'db5':{
            "host": "localhost",
            "user": "root",
            "password": "))lT%)MKo0xH",
            "port": "3306",
            database       : 'auto_yandex',
            connectionLimit: 3,
            timezone       : 'local',
            dateStrings    : true
        }
    },
    template: {
        path: 'app/views',
        options: {
            ext: 'ect',
            cache: false
        }
    },
    session: {
        secretKey: 'myKoajsSecretKey'
    }
};