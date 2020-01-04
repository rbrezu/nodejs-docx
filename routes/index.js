const routes = require('express').Router();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const converter = require('office-converter')();
const uuidv4 = require('uuid/v4');


routes.use(fileUpload());
routes.use(bodyParser.urlencoded({ extended: true }));
routes.use(bodyParser.json());

routes.use((req, res, next) => {
    // do logging
    console.log(`Resource requested: ${req.method} ${req.originalUrl}`);
    next(); // make sure we go to the next routes and don't stop here
});

routes.get('/', (req, res) => {
    res.sendFile(path.join(appRoot + '/index.html'));
    // res.status(200).json({ success: true, message: 'Hello world!' });
});


routes.post('/upload', function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({message: 'No files were uploaded.'});
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    let [name, extension] = sampleFile.name.split('.');
    console.log(name, extension);

    let filePath = fileRoot + `/${uuidv4().replace(/-/g, '')}.${extension}`;
    sampleFile.mv(filePath, function(err) {
        if (err)
            return res.status(500).send({err});

        console.log('File uploaded!');
        converter.generatePdf(filePath, function(err, result) {
            // Process result if no error
            if (err)
                return res.status(500).send({err});

            if (result.status === 0) {
                res.download(result.outputFile, `${name}.pdf`);
                console.log('Output File located at ' + result.outputFile);
            }
        });

    });
});

module.exports = routes;
