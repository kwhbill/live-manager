module.exports = {
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "globals": {
        "_": false,
        "$": false,
        "zj": false,
        "dll": false,
        "prod": false,
        "process": false
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module"
    },
    "rules": {
        "no-unused-vars": ["error", { "varsIgnorePattern": "^_\\w+", "argsIgnorePattern": "^_\\w+" }],
        "no-empty": ["error", { "allowEmptyCatch": true }],
        "no-console": "off",
        "indent": [
            "warn",
            4
        ],
        "linebreak-style": [
            "warn",
            "unix"
        ],
        "quotes": [
            "warn",
            "double"
        ],
        "semi": [
            "warn",
            "never"
        ]
    }
};