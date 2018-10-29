// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "generateguid" is now active!');
    const v1GuidGenerator = require('uuid/v1');
    const v3GuidGenerator = require('uuid/v3');
    const v4GuidGenerator = require('uuid/v4');
    const v5GuidGenerator = require('uuid/v5');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let setGuidNamespace = vscode.commands.registerCommand('extension.setGuidNamespace', function () {
        getInput("Enter a namespace to use for your GUID").then(function(inputValue) {
            var namespaceConfig = vscode.workspace.getConfiguration("generateGuid");
            namespaceConfig.update('namespace', inputValue, true);
        });
    });

    let setGuidType = vscode.commands.registerCommand('extension.setGuidType', function() {
        var quickPickOptions = { matchOnDescription: true, placeHolder: "What type of GUID do you want to generate?" };
        var items = [];
    
        items.push({ label: "V1", description: "Use V1 type GUID" });
        items.push({ label: "V3", description: "Use V3 type GUID" });
        items.push({ label: "V4", description: "Use V4 type GUID" });
        items.push({ label: "V5", description: "Use V5 type GUID" });

        vscode.window.showQuickPick(items).then(function (selection) {
            var namespaceConfig = vscode.workspace.getConfiguration("generateGuid");
            namespaceConfig.update('guidType', selection.label, true);
        });        
    });

    let generateGuid = vscode.commands.registerCommand('extension.generateGuid', function () {
        // Display a message box to the user
        var editor = vscode.window.activeTextEditor;
        var cursorPosition = editor.selection.active;
        generateGuidHelper().then(function (guid) {
            var textEdit = vscode.TextEdit.insert(cursorPosition, guid);
            var workspaceEdit = new vscode.WorkspaceEdit();
            workspaceEdit.set(vscode.window.activeTextEditor.document.uri, [textEdit]);
            vscode.workspace.applyEdit(workspaceEdit);
        }, function (errorMsg) {
            vscode.window.showInformationMessage(errorMsg);
        });
    });

    context.subscriptions.push(setGuidType);
    context.subscriptions.push(setGuidNamespace);
    context.subscriptions.push(generateGuid);

    // Helpers below here
    var generateGuidHelper = function () {
        return new Promise(function(resolve, reject) {
            var namespaceConfig = vscode.workspace.getConfiguration("generateGuid");
            var namespace = namespaceConfig.get("namespace");
            var guidVersion = namespaceConfig.get("guidType");
            switch (guidVersion) {
                case "V1":
                    resolve(v1GuidGenerator());
                    break;
                case "V3":
                    if (namespace == null || namespace == "") {
                        reject("Please set a namespace for your GUID");
                    }
                    else {
                        getInput("What is the name to use for the GUID?").then(function(inputValue) {
                            resolve(v3GuidGenerator(inputValue, namespace));
                        });
                    }
                    break;
                case "V4":
                    resolve(v4GuidGenerator());
                    break;
                case "V5":
                    if (namespace == null || namespace == "") {
                        reject("Please set a namespace for your GUID");
                    }
                    else {
                        getInput("What is the name to use for the GUID?").then(function(inputValue) {
                            resolve(v5GuidGenerator(inputValue, namespace));
                        });
                    }
                    break;
                default:
                    reject("Please set the version of GUID you want to use.");
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