"use strict";
/// <reference path="../../definitions/mocha.d.ts"/>
/// <reference path="../../definitions/node.d.ts"/>
/// <reference path="../../definitions/Q.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const trm = require("../../lib/taskRunner");
const path = require("path");
var shell = require('shelljs');
function setResponseFile(name) {
    process.env['MOCK_RESPONSES'] = path.join(__dirname, name);
    process.env['MOCK_NORMALIZE_SLASHES'] = true;
}
var jobName = 'FtpUpload';
describe(jobName + ' Suite', function () {
    this.timeout(10000);
    before((done) => {
        // init here
        done();
    });
    after(function () {
    });
    var responseFiles = ['ftpUploadWin.json', 'ftpUploadLinux.json'];
    responseFiles.forEach((responseFile) => {
        var isWin = responseFile == 'ftpUploadWin.json';
        var os = isWin ? 'Windows' : 'Linux';
        it(os + ' check args: no serverEndpoint', (done) => {
            setResponseFile(responseFile);
            var tr = new trm.TaskRunner(jobName, true);
            tr.setInput('credsType', 'serviceEndpoint');
            tr.run()
                .then(() => {
                assert(tr.stderr.indexOf('Input required: serverEndpoint') != -1, 'should have written to stderr');
                assert(tr.failed, 'task should have failed');
                done();
            })
                .fail((err) => {
                console.log(err);
                done(err);
            });
        });
        it(os + ' check args: no rootFolder', (done) => {
            setResponseFile(responseFile);
            var tr = new trm.TaskRunner(jobName, true);
            tr.setInput('serverEndpoint', 'ID1');
            tr.run()
                .then(() => {
                assert(tr.stderr.indexOf('Input required: rootFolder') != -1, 'should have written to stderr');
                assert(tr.failed, 'task should have failed');
                done();
            })
                .fail((err) => {
                console.log(err);
                done(err);
            });
        });
        it(os + ' check args: no filePatterns', (done) => {
            setResponseFile(responseFile);
            var tr = new trm.TaskRunner(jobName, true);
            tr.setInput('serverEndpoint', 'ID1');
            tr.setInput('rootFolder', 'rootFolder');
            tr.run()
                .then(() => {
                assert(tr.stderr.indexOf('Input required: filePatterns') != -1, 'should have written to stderr');
                assert(tr.failed, 'task should have failed');
                done();
            })
                .fail((err) => {
                console.log(err);
                done(err);
            });
        });
        it(os + ' check args: no remotePath', (done) => {
            setResponseFile(responseFile);
            var tr = new trm.TaskRunner(jobName, true);
            tr.setInput('serverEndpoint', 'ID1');
            tr.setInput('rootFolder', 'rootFolder');
            tr.setInput('filePatterns', '**');
            tr.run()
                .then(() => {
                assert(tr.stderr.indexOf('Input required: remotePath') != -1, 'should have written to stderr');
                assert(tr.failed, 'task should have failed');
                done();
            })
                .fail((err) => {
                console.log(err);
                done(err);
            });
        });
        it(os + ' check args: no clean', (done) => {
            setResponseFile(responseFile);
            var tr = new trm.TaskRunner(jobName, true);
            tr.setInput('serverEndpoint', 'ID1');
            tr.setInput('rootFolder', 'rootFolder');
            tr.setInput('filePatterns', '**');
            tr.setInput('remotePath', '/upload/');
            tr.run()
                .then(() => {
                assert(tr.stderr.indexOf('Input required: clean') != -1, 'should have written to stderr');
                assert(tr.failed, 'task should have failed');
                done();
            })
                .fail((err) => {
                console.log(err);
                done(err);
            });
        });
        it(os + ' check args: no overwrite', (done) => {
            setResponseFile(responseFile);
            var tr = new trm.TaskRunner(jobName, true);
            tr.setInput('serverEndpoint', 'ID1');
            tr.setInput('rootFolder', 'rootFolder');
            tr.setInput('filePatterns', '**');
            tr.setInput('remotePath', '/upload/');
            tr.setInput('clean', 'true');
            tr.run()
                .then(() => {
                assert(tr.stderr.indexOf('Input required: overwrite') != -1, 'should have written to stderr');
                assert(tr.failed, 'task should have failed');
                done();
            })
                .fail((err) => {
                console.log(err);
                done(err);
            });
        });
        it(os + ' check args: no preservePaths', (done) => {
            setResponseFile(responseFile);
            var tr = new trm.TaskRunner(jobName, true);
            tr.setInput('serverEndpoint', 'ID1');
            tr.setInput('rootFolder', 'rootFolder');
            tr.setInput('filePatterns', '**');
            tr.setInput('remotePath', '/upload/');
            tr.setInput('clean', 'true');
            tr.setInput('overwrite', 'true');
            tr.run()
                .then(() => {
                assert(tr.stderr.indexOf('Input required: preservePaths') != -1, 'should have written to stderr');
                assert(tr.failed, 'task should have failed');
                done();
            })
                .fail((err) => {
                console.log(err);
                done(err);
            });
        });
        it(os + ' check args: trustSSL', (done) => {
            setResponseFile(responseFile);
            var tr = new trm.TaskRunner(jobName, true);
            tr.setInput('serverEndpoint', 'ID1');
            tr.setInput('rootFolder', 'rootFolder');
            tr.setInput('filePatterns', '**');
            tr.setInput('remotePath', '/upload/');
            tr.setInput('clean', 'true');
            tr.setInput('overwrite', 'true');
            tr.setInput('preservePaths', 'true');
            tr.run()
                .then(() => {
                assert(tr.stderr.indexOf('Input required: trustSSL') != -1, 'should have written to stderr');
                assert(tr.failed, 'task should have failed');
                done();
            })
                .fail((err) => {
                console.log(err);
                done(err);
            });
        });
        it(os + ' check args: missing protocol on server URL (ftp:// or ftps://)', (done) => {
            setResponseFile(responseFile);
            var tr = new trm.TaskRunner(jobName, true);
            tr.setInput('credsType', 'inputs');
            tr.setInput('serverUrl', 'noprotocol.microsoft.com');
            tr.setInput('username', 'myUsername');
            tr.setInput('password', 'myPassword');
            tr.setInput('rootFolder', 'rootFolder');
            tr.setInput('filePatterns', '**');
            tr.setInput('remotePath', '/upload/');
            tr.setInput('clean', 'true');
            tr.setInput('overwrite', 'true');
            tr.setInput('preservePaths', 'true');
            tr.setInput('trustSSL', 'true');
            tr.run()
                .then(() => {
                assert(tr.stderr.indexOf('The FTP server URL must begin with ftp:// or ftps://') != -1, 'A protocol should have been required in the server URL.');
                assert(tr.failed, 'task should have failed');
                done();
            })
                .fail((err) => {
                console.log(err);
                done(err);
            });
        });
        it(os + ' check args: missing host name on server URL', (done) => {
            setResponseFile(responseFile);
            var tr = new trm.TaskRunner(jobName, true);
            tr.setInput('credsType', 'inputs');
            tr.setInput('serverUrl', 'ftps://');
            tr.setInput('username', 'myUsername');
            tr.setInput('password', 'myPassword');
            tr.setInput('rootFolder', 'rootFolder');
            tr.setInput('filePatterns', '**');
            tr.setInput('remotePath', '/upload/');
            tr.setInput('clean', 'true');
            tr.setInput('overwrite', 'true');
            tr.setInput('preservePaths', 'true');
            tr.setInput('trustSSL', 'true');
            tr.run()
                .then(() => {
                assert(tr.stderr.indexOf('The FTP server URL must include a host name') != -1, 'A host name should have been required in the server URL.');
                assert(tr.failed, 'task should have failed');
                done();
            })
                .fail((err) => {
                console.log(err);
                done(err);
            });
        });
    });
});
