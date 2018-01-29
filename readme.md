# Spine Smartcard Access

Spine Smartcard Access allows users to access NHS spine enabled applications.

## Setup Chrome Extension
* clone the repo
* cd into the cloned folder
* Background.js : add your url to the list of websites in content_scripts, matches and externally_connectable, matches. e.g
[{"matches":["https://sus-access.national.ncrs.nhs.uk/","https://*{website_url}* "]}] NOTE THIS URL MUST BE HTTPS.
* Auth.js - Generate a plugin ID for the Chrome extension using the [following Link](https://developer.chrome.com/apps/packaging "Title"), once generated add the id to the auth.js file in the first line. Replace {pluginID} with an actual ID.

## Installing the Extension
* Go to Settings menu in Chrome -> More tools -> Extensions
* Enable Developer mode by ticking the box, next to it.
* Select load unpacked extension, then navigate to the extension folder.

## Installation Native Bridge

The Chrome extension works in conjuction with the native bridge which is a .NET application which provides an API for the extension to access the inserted smartcard.

The installation file is available at the following locations - 

* https://www.dropbox.com/sh/ja1ylh2pg1wh4j4/AAClgR6g-rcpOnahfdnZyFZWa?dl=0
* http://nww.hscic.gov.uk/dir/downloads/chrome-extension/nativebridge.zip

* From the downloaded Nativebridge.zip file run NativeBridgeInstaller, this will create the C:\Program Files\HSCIC\NativeBridge or C:\Program Files (x86)\HSCIC\NativeBridge, depending on your installation location and the accompanying app data files.

* In order to allow this communication you need to add the Chrome ID to the installed Native bridge json file. Add the {pluginID} to the whitelist.

* Edit the uk.nhs.ncrs.auth.json file : Navigate to the C:\Users\[username]\AppData\Local\HSCIC\Native folder and edit the auth permission file. Add the {pluginID} to the allowed origins array.

~~~~
"allowed_origins": [
	"chrome-extension://ncgfdaipgceflkflfffaejlnjplhnbfn/",
	"chrome-extension://{pluginID}"
]
~~~~

## Smartcard and reader
You will need a SPINE enabled smartcard and reader.

## Testing

After intstalling all the required dependencies. 

Insert the smartcard, authenticate to Spine then launch a SPINE enabled application e.g https://sus-access.national.ncrs.nhs.uk/ in Chrome. 

This will trigger the login process within the web app, which in turn triggers the Chrome extension to send messages to the Bridge requesting for a token, which is passed to the app.

## License

This project is licensed under the MIT License