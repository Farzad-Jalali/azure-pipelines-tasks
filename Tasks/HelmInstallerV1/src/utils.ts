"use strict";

import tl = require('vsts-task-lib/task');
import path = require('path');
import fs = require('fs');
import * as toolLib from 'vsts-task-tool-lib/tool';
import * as utils from './utils';
import * as os from "os";
import * as util from "util";
import { WebRequest, sendRequest } from 'utility-common/restutilities';

const uuidV4 = require('uuid/v4');
const helmToolName = "helm"
const helmLatestReleaseUrl = "https://api.github.com/repos/helm/helm/releases/latest";
const stableHelmVersion = "v2.9.1"

export async function getHelmVersion(): Promise<string> {
    let helmVersion = tl.getInput("helmVersion");
    if (helmVersion && helmVersion != "latest") {
        return sanitizeVersionString(helmVersion);
    }

    return await getStableHelmVersion();
}

export async function downloadHelm(version: string): Promise<string> {
    var cachedToolpath = toolLib.findLocalTool(helmToolName, version);
    if (!cachedToolpath) {
        try {
            var helmDownloadPath = await toolLib.downloadTool(getHelmDownloadURL(version), helmToolName + "-" + version + "-" + uuidV4() + ".zip");
        } catch (exception) {
            throw new Error(tl.loc("HelmDownloadFailed", getHelmDownloadURL(version), exception));
        }

        var unzipedHelmPath = await toolLib.extractZip(helmDownloadPath);
        cachedToolpath = await toolLib.cacheDir(unzipedHelmPath, helmToolName, version);
    }

    var helmpath = findHelm(cachedToolpath);
    if (!helmpath) {
        throw new Error(tl.loc("HelmNotFoundInFolder", cachedToolpath))
    }

    fs.chmodSync(helmpath, "777");
    return helmpath;
}

function findHelm(rootFolder: string) {
    var helmPath = path.join(rootFolder, "*", helmToolName + getExecutableExtention());
    var allPaths = tl.find(rootFolder);
    var matchingResultsFiles = tl.match(allPaths, helmPath, rootFolder);
    return matchingResultsFiles[0];
}


function getHelmDownloadURL(version: string): string {
    switch (os.type()) {
        case 'Linux':
            return util.format("https://storage.googleapis.com/kubernetes-helm/helm-%s-linux-amd64.zip", version);

        case 'Darwin':
            return util.format("https://storage.googleapis.com/kubernetes-helm/helm-%s-darwin-amd64.zip", version);

        default:
        case 'Windows_NT':
            return util.format("https://storage.googleapis.com/kubernetes-helm/helm-%s-windows-amd64.zip", version);

    }
}

async function getStableHelmVersion(): Promise<string> {
    var request = new WebRequest();
    request.uri = "https://api.github.com/repos/helm/helm/releases/latest";
    request.method = "GET";

    try {
        var response = await sendRequest(request);
        return response.body["tag_name"];
    } catch (error) {
        tl.warning(tl.loc("HelmLatestNotKnown", helmLatestReleaseUrl, error, stableHelmVersion));
    }

    return stableHelmVersion;
}

function getExecutableExtention(): string {
    if (os.type().match(/^Win/)) {
        return ".exe";
    }

    return "";
} 

// handle user input scenerios
export function sanitizeVersionString(inputVersion: string) : string{
    var version = toolLib.cleanVersion(inputVersion);
    if(!version) {
        throw new Error(tl.loc("NotAValidSemverVersion"));
    }
    
    return "v"+version;
}