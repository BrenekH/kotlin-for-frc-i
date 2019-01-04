"use strict";
import * as vscode from "vscode";
import * as filegenerator from "./file_generator";
import * as templateinterpreter from "./template_interpreter";
import * as rimraf from "rimraf";
import * as fs from "fs";

export function createNew() {
	
}

export function createCommand(file_path: any) {
	parseAndSaveTemplateToDocument(file_path, "frc.robot", templateinterpreter.templateType.command);
}

export function createCommandGroup(file_path: any) {
	parseAndSaveTemplateToDocument(file_path, "frc.robot", templateinterpreter.templateType.command_group);
}

export function createSubsystem(file_path: any) {
	parseAndSaveTemplateToDocument(file_path, "frc.robot", templateinterpreter.templateType.subsystem);
}

function parseAndSaveTemplateToDocument(file_path: any, package_name: string, templateType: templateinterpreter.templateType) {
	console.log(file_path);
	vscode.window.showInputBox({
		placeHolder: "Name your command group"
	}).then(value => {
		if (!value) { return; }
		var user_data = value;
		if (typeof vscode.workspace.workspaceFolders === 'undefined') {
			return;
		}
		var workspace_folder_path = vscode.workspace.workspaceFolders[0].uri.fsPath;
		var path_to_pass = file_path.fsPath.replace(workspace_folder_path, "");
		filegenerator.showDocumentInViewer(filegenerator.createFileWithContent(path_to_pass + "/" + user_data + ".kt", templateinterpreter.parseTemplate(user_data, package_name, templateType)));
	});
}

export function convertJavaProject(current_robot_type: templateinterpreter.robotType) {
	console.log("Deleting java project");
	if (typeof vscode.workspace.workspaceFolders === 'undefined') {
		return;
	}
	var pathToDelete = vscode.workspace.workspaceFolders[0].uri.fsPath + "/src/main/java";
	console.log(pathToDelete);
	rimraf(pathToDelete, function () {
		console.log("Done deleting");
		console.log("Recreating structure");
		if (typeof vscode.workspace.workspaceFolders === 'undefined') {
			console.log("Not a valid workspace");
			vscode.window.showErrorMessage("Kotlin for FRC: Not a valid workspace!");
			return;
		}
		if (!fs.existsSync(vscode.workspace.workspaceFolders[0].uri.fsPath + "/src/main/kotlin")) {
			fs.mkdirSync(vscode.workspace.workspaceFolders[0].uri.fsPath + "/src/main/kotlin");
		}
		if (!fs.existsSync(vscode.workspace.workspaceFolders[0].uri.fsPath + "/src/main/kotlin/frc")) {
			fs.mkdirSync(vscode.workspace.workspaceFolders[0].uri.fsPath + "/src/main/kotlin/frc");
		}
		if (!fs.existsSync(vscode.workspace.workspaceFolders[0].uri.fsPath + "/src/main/kotlin/frc/robot")) {
			fs.mkdirSync(vscode.workspace.workspaceFolders[0].uri.fsPath + "/src/main/kotlin/frc/robot");
		}
		console.log("Done recreating basic file structure");
		
		switch(current_robot_type) {
			case templateinterpreter.robotType.command:
				convertCommand();
				break;
			case templateinterpreter.robotType.sample:
				convertSample();
				break;
			case templateinterpreter.robotType.iterative:
				convertIterative();
				break;
			case templateinterpreter.robotType.timed:
				convertTimed();
				break;
			case templateinterpreter.robotType.timed_skeleton:
				convertTimedSkeleton();
				break;
			default:
				vscode.window.showErrorMessage("Kotlin For FRC: ERROR 'Invalid Template Type'. Please report in the issues section on github with a detailed description of what steps were taken.");
				return;
		}

		vscode.window.showInformationMessage("Kotlin for FRC: Conversion complete!");
	});
}

function convertIterative() {
	filegenerator.createFileWithContent("/src/main/kotlin/frc/robot/Robot.kt", templateinterpreter.getTemplateObjectFromRobotType(templateinterpreter.robotType.iterative).getText());
	filegenerator.createFileWithContent("/src/main/kotlin/frc/robot/Main.kt", templateinterpreter.getMainTemplateObject().getText());
	filegenerator.createFileWithContent("build.gradle", templateinterpreter.getTemplateObjectFromTemplateType(templateinterpreter.templateType.build_gradle).getText());
}

function convertTimed() {
	filegenerator.createFileWithContent("/src/main/kotlin/frc/robot/Robot.kt", templateinterpreter.getTemplateObjectFromRobotType(templateinterpreter.robotType.timed).getText());
	filegenerator.createFileWithContent("/src/main/kotlin/frc/robot/Main.kt", templateinterpreter.getMainTemplateObject().getText());
	filegenerator.createFileWithContent("build.gradle", templateinterpreter.getTemplateObjectFromTemplateType(templateinterpreter.templateType.build_gradle).getText());
}

function convertTimedSkeleton() {
	filegenerator.createFileWithContent("build.gradle", templateinterpreter.getTemplateObjectFromTemplateType(templateinterpreter.templateType.build_gradle).getText());
}

function convertCommand() {
	if (typeof vscode.workspace.workspaceFolders === 'undefined') {
		console.log("Not a valid workspace");
		vscode.window.showErrorMessage("Kotlin for FRC: Not a valid workspace!");
		return;
	}

	if (!fs.existsSync(vscode.workspace.workspaceFolders[0].uri.fsPath + "/src/main/kotlin/frc/robot/commands")) {
		fs.mkdirSync(vscode.workspace.workspaceFolders[0].uri.fsPath + "/src/main/kotlin/frc/robot/commands");
	}
	if (!fs.existsSync(vscode.workspace.workspaceFolders[0].uri.fsPath + "/src/main/kotlin/frc/robot/subsystems")) {
		fs.mkdirSync(vscode.workspace.workspaceFolders[0].uri.fsPath + "/src/main/kotlin/frc/robot/subsystems");
	}

	//Static files(don't need any name changes)
	filegenerator.createFileWithContent("/src/main/kotlin/frc/robot/Robot.kt", templateinterpreter.getTemplateObjectFromTemplateType(templateinterpreter.templateType.robot).getText());
	filegenerator.createFileWithContent("/src/main/kotlin/frc/robot/RobotMap.kt", templateinterpreter.getTemplateObjectFromTemplateType(templateinterpreter.templateType.robot_map).getText());
	filegenerator.createFileWithContent("/src/main/kotlin/frc/robot/OI.kt", templateinterpreter.getTemplateObjectFromTemplateType(templateinterpreter.templateType.oi).getText());
	filegenerator.createFileWithContent("build.gradle", templateinterpreter.getTemplateObjectFromTemplateType(templateinterpreter.templateType.build_gradle).getText());
	filegenerator.createFileWithContent("/src/main/kotlin/frc/robot/Main.kt", templateinterpreter.getMainTemplateObject().getText());
	
	//Dynamic files(need name changes)
	filegenerator.createFileWithContent("/src/main/kotlin/frc/robot/commands/ExampleCommand.kt", templateinterpreter.parseTemplate("ExampleCommand", "frc.robot.commands", templateinterpreter.templateType.command));
	filegenerator.createFileWithContent("/src/main/kotlin/frc/robot/subsystems/ExampleSubsystem.kt", templateinterpreter.parseTemplate("ExampleSubsystem", "frc.robot.subsystems", templateinterpreter.templateType.subsystem));
}

function convertSample() {
	filegenerator.createFileWithContent("/src/main/kotlin/frc/robot/Robot.kt", templateinterpreter.getTemplateObjectFromRobotType(templateinterpreter.robotType.sample).getText());
	filegenerator.createFileWithContent("/src/main/kotlin/frc/robot/Main.kt", templateinterpreter.getMainTemplateObject().getText());
	filegenerator.createFileWithContent("build.gradle", templateinterpreter.getTemplateObjectFromTemplateType(templateinterpreter.templateType.build_gradle).getText());
}