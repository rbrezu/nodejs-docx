// index.js
const path = require('path');
global.appRoot = path.resolve(__dirname);
global.fileRoot =  process.env.FILE_PATH || path.resolve(__dirname) + '/files';

const express = require('express');
const routes = require('./routes');

const app = express();

const port = process.env.PORT || 8081; // set our port

app.use('/', routes);

app.use((err, req, res, next) => {
    res.status(err.status || 400).json({
        success: false,
        message: err.message || 'An error occured.',
        errors: err.error || [],
    });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Resource not found.' });
});

// Start the server
app.listen(port);

console.log(`Server started on port ${port}`);
