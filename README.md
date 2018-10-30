# generateuuid README

This is a simple utility used to make inserting UUIDs, also known as GUIDs, faster by providing a keyboard shortcut. It generates UUIDs using the [uuid library](https://www.npmjs.com/package/uuid).

## Features

There are three commands exposed by this extension. 
* `Set UUID namespace` -> If you are using a UUID version which takes a namespace, you must first set the namespace using this command. This namespace will persist until it is changed again using the same command.
* `Set UUID type` -> The version of UUID you want to generate. The [uuid library](https://www.npmjs.com/package/uuid) has great information on the different versions. This value will also persist until changed. 
* `Generate UUID` (cmd+k cmd+g, ctl+k ctl+g) -> Generates the actual UUID and puts it where the cursor is currently is. If a version of UUID that needs a "name" value is selected, this command will prompt for a "name" value.

## Requirements

No requirements.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `generateUuid.namespace`: used to store the namespace you want you UUIDs to use. Set by the command `Set UUID namespace`
* `generateUuid.uuidType`: used to store the version of UUID you want the `Generate UUID` command to create

## Known Issues

None yet, but I am sure they are hiding ready to be reported.

## Release Notes

Inital releases.
