// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "generateuuid" is now active!');
    const v1UuidGenerator = require('uuid/v1');
    const v3UuidGenerator = require('uuid/v3');
    const v4UuidGenerator = require('uuid/v4');
    const v5UuidGenerator = require('uuid/v5');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let setUuidNamespace = vscode.commands.registerCommand('extension.setUuidNamespace', function () {
        getInput("Enter a namespace to use for your Uuid").then(function(inputValue) {
            var namespaceConfig = vscode.workspace.getConfiguration("generateUuid");
            namespaceConfig.update('namespace', inputValue, true);
        });
    });

    let setUuidType = vscode.commands.registerCommand('extension.setUuidType', function() {
        var quickPickOptions = { matchOnDescription: true, placeHolder: "What type of UUID do you want to generate?" };
        var items = [];
    
        items.push({ label: "V1", description: "Use V1 type UUID" });
        items.push({ label: "V3", description: "Use V3 type UUID" });
        items.push({ label: "V4", description: "Use V4 type UUID" });
        items.push({ label: "V5", description: "Use V5 type UUID" });

        vscode.window.showQuickPick(items).then(function (selection) {
            var namespaceConfig = vscode.workspace.getConfiguration("generateUuid");
            namespaceConfig.update('uuidType', selection.label, true);
        });        
    });

    let generateUuid = vscode.commands.registerCommand('extension.generateUuid', function () {
        // Display a message box to the user
        var editor = vscode.window.activeTextEditor;
        var cursorPosition = editor.selection.active;
        generateUuidHelper().then(function (uuid) {
            var textEdit = vscode.TextEdit.insert(cursorPosition, uuid);
            var workspaceEdit = new vscode.WorkspaceEdit();
            workspaceEdit.set(vscode.window.activeTextEditor.document.uri, [textEdit]);
            vscode.workspace.applyEdit(workspaceEdit);
        }, function (errorMsg) {
            vscode.window.showInformationMessage(errorMsg);
        });
    });

    context.subscriptions.push(setUuidType);
    context.subscriptions.push(setUuidNamespace);
    context.subscriptions.push(generateUuid);

    // Helpers below here
    var generateUuidHelper = function () {
        return new Promise(function(resolve, reject) {
            var namespaceConfig = vscode.workspace.getConfiguration("generateUuid");
            var namespace = namespaceConfig.get("namespace");
            var uuidVersion = namespaceConfig.get("uuidType");
            switch (uuidVersion) {
                case "V1":
                    resolve(v1UuidGenerator());
                    break;
                case "V3":
                    if (namespace == null || namespace == "") {
                        reject("Please set a namespace for your UUID");
                    }
                    else {
                        getInput("What is the name to use for the UUID?").then(function(inputValue) {
                            resolve(v3UuidGenerator(inputValue, namespace));
                        });
                    }
                    break;
                case "V4":
                    resolve(v4UuidGenerator());
                    break;
                case "V5":
                    if (namespace == null || namespace == "") {
                        reject("Please set a namespace for your UUID");
                    }
                    else {
                        getInput("What is the name to use for the UUID?").then(function(inputValue) {
                            resolve(v5UuidGenerator(inputValue, namespace));
                        });
                    }
                    break;
                default:
                    reject("Please set the version of UUID you want to use.");
                    break;
            }
        })
    }

    var getInput = function(placeHolder) {
        return new Promise(function(resolve) {
            vscode.window.showInputBox({"placeHolder": placeHolder})
                .then(function(inputValue) {
                    resolve(inputValue);
                });
        });
    }
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;