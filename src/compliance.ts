"use strict";
import * as vscode from "vscode";
import { targetGradleRioVersion } from "./constants";
import { createBuildGradle, createMainKt } from "./commands";
import * as preferences from "./preferences";
import * as fs from "fs";
import * as kotlinExt from "./extension";

export function isBuildGradleCompliant(): boolean {
    console.log("Checking build.gradle compliance");
    let registeredVersion = preferences.getWPILibVersion();
    if (registeredVersion === targetGradleRioVersion) {
        return true;
    }
    return false;
}

export function isMainKtCompliant(): boolean {
    console.log("Checking Main.kt compliance");
    if (preferences.getMainKt()) {
        return true;
    }
    return false;
}

export function makeBuildGradleCompliant() {
    console.log("Forcing build.gradle compliance");
    createBuildGradle();
    vscode.window.showInformationMessage("GradleRio version updated");
    preferences.setWPILibVersion(targetGradleRioVersion);
}

export function makeMainKtCompliant() {
    console.log("Forcing Main.kt compliance");
    createMainKt();
    vscode.window.showInformationMessage("Main.java converted to Main.kt");
    preferences.setMainKt(true);
}

export function isKotlinProject(): boolean {
    return fs.existsSync(kotlinExt.getWorkspaceFolderFsPath() + "/src/main/java/frc/robot/Robot.kt");
}
