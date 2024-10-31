; Script generated by the Inno Setup Script Wizard.
; SEE THE DOCUMENTATION FOR DETAILS ON CREATING INNO SETUP SCRIPT FILES!

#define MyAppName "BlackBot"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "My Company, Inc."
#define MyAppURL "https://www.example.com/"
#define MyAppExeName "BlackBot.exe"
#define SourcePath "D:\a\UI_BB_Py_Auto\UI_BB_Py_Auto\dist\win-unpacked"


[Setup]
; NOTE: The value of AppId uniquely identifies this application. Do not use the same AppId value in installers for other applications.
; (To generate a new GUID, click Tools | Generate GUID inside the IDE.)
AppId={{E2FC8089-0BDE-431A-B358-5E8DA9B220D7}}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DisableProgramGroupPage=yes
LicenseFile={#SourcePath}\LICENSE.electron.txt
; Remove the following line to run in administrative install mode (install for all users.)
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=dialog
OutputBaseFilename=BlackBot-Setup
; SetupIconFile={#SourcePath}\resources\icon.ico
Compression=lzma
SolidCompression=yes
WizardStyle=modern

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "armenian"; MessagesFile: "compiler:Languages\Armenian.isl"
Name: "brazilianportuguese"; MessagesFile: "compiler:Languages\BrazilianPortuguese.isl"
Name: "bulgarian"; MessagesFile: "compiler:Languages\Bulgarian.isl"
Name: "catalan"; MessagesFile: "compiler:Languages\Catalan.isl"
Name: "corsican"; MessagesFile: "compiler:Languages\Corsican.isl"
Name: "czech"; MessagesFile: "compiler:Languages\Czech.isl"
Name: "danish"; MessagesFile: "compiler:Languages\Danish.isl"
Name: "dutch"; MessagesFile: "compiler:Languages\Dutch.isl"
Name: "finnish"; MessagesFile: "compiler:Languages\Finnish.isl"
Name: "french"; MessagesFile: "compiler:Languages\French.isl"
Name: "german"; MessagesFile: "compiler:Languages\German.isl"
Name: "hebrew"; MessagesFile: "compiler:Languages\Hebrew.isl"
Name: "icelandic"; MessagesFile: "compiler:Languages\Icelandic.isl"
Name: "italian"; MessagesFile: "compiler:Languages\Italian.isl"
Name: "japanese"; MessagesFile: "compiler:Languages\Japanese.isl"
Name: "norwegian"; MessagesFile: "compiler:Languages\Norwegian.isl"
Name: "polish"; MessagesFile: "compiler:Languages\Polish.isl"
Name: "portuguese"; MessagesFile: "compiler:Languages\Portuguese.isl"
Name: "russian"; MessagesFile: "compiler:Languages\Russian.isl"
Name: "slovak"; MessagesFile: "compiler:Languages\Slovak.isl"
Name: "slovenian"; MessagesFile: "compiler:Languages\Slovenian.isl"
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"
Name: "turkish"; MessagesFile: "compiler:Languages\Turkish.isl"
Name: "ukrainian"; MessagesFile: "compiler:Languages\Ukrainian.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: checked

[Files]
Source: "{#SourcePath}\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#SourcePath}\chrome_100_percent.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#SourcePath}\chrome_200_percent.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#SourcePath}\d3dcompiler_47.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#SourcePath}\ffmpeg.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#SourcePath}\icudtl.dat"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#SourcePath}\libEGL.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#SourcePath}\libGLESv2.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#SourcePath}\LICENSE.electron.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#SourcePath}\LICENSES.chromium.html"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#SourcePath}\resources.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#SourcePath}\snapshot_blob.bin"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#SourcePath}\v8_context_snapshot.bin"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#SourcePath}\vk_swiftshader.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#SourcePath}\vk_swiftshader_icd.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#SourcePath}\vulkan-1.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#SourcePath}\scripts\*"; DestDir: "{app}\scripts"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "{#SourcePath}\resources\*"; DestDir: "{app}\resources"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "{#SourcePath}\locales\*"; DestDir: "{app}\locales"; Flags: ignoreversion recursesubdirs createallsubdirs
; NOTE: Don't use "Flags: ignoreversion" on any shared system files

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
;Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent
; Set execution policy for PowerShell scripts
Filename: "powershell"; Parameters: "-Command Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"; Flags: runhidden waituntilterminated; StatusMsg: "Setting PowerShell execution policy..."

; Check if winget is available
Filename: "cmd"; Parameters: "/c winget --version"; Flags: runhidden waituntilterminated; Check: WingetAvailable; StatusMsg: "Checking if winget is available..."

; Install Python for the current user (no admin privileges)
Filename: "cmd"; Parameters: "/c winget install Python.Python.3.12 --scope=user"; Flags: runhidden waituntilterminated; Check: NeedsPython; StatusMsg: "Installing Python..."

; Install Node.js for the current user (no admin privileges)
; Filename: "cmd"; Parameters: "/c winget install OpenJS.NodeJS --scope=user"; Flags: runhidden waituntilterminated; Check: NeedsNodeJS; StatusMsg: "Installing Node.js..."

; Run the setup.bat after installation
Filename: "{app}\scripts\BB_Py_Automation\setup.bat"; WorkingDir: "{app}\scripts\BB_Py_Automation"; Flags: runhidden waituntilterminated; StatusMsg: "Running setup script..."

; Run npm install
; Filename: "cmd"; Parameters: "/c npm install"; WorkingDir: "{app}\UI_BB_Py_Auto"; Flags: runhidden waituntilterminated; StatusMsg: "Running npm setup script..."

[Code]
function WingetAvailable: Boolean;
var
  ResultCode: Integer;
begin
  Result := Exec('cmd.exe', '/C winget --version', '', SW_HIDE, ewWaitUntilTerminated, ResultCode) and (ResultCode = 0);
end;

function NeedsPython: Boolean;
var
  ResultCode: Integer;
begin
  Result := not Exec('cmd.exe', '/C python --version', '', SW_HIDE, ewWaitUntilTerminated, ResultCode) or (ResultCode <> 0);
end;

function NeedsNodeJS: Boolean;
var
  ResultCode: Integer;
begin
  Result := not Exec('cmd.exe', '/C node --version', '', SW_HIDE, ewWaitUntilTerminated, ResultCode) or (ResultCode <> 0);
end;