!macro preInstall
    ; Check if the scripts folder exists and contains files
    IfFileExists "$INSTDIR\scripts\*.*" 0 no_scripts_to_backup

    ; Ensure the backup folder exists
    IfFileExists "$INSTDIR\backup_scripts\*" 0 create_backup_folder

    create_backup_folder:
        CreateDirectory "$INSTDIR\backup_scripts"

    ; Copy files from scripts to backup folder
    DetailPrint "Backing up files from $INSTDIR\scripts to $INSTDIR\backup_scripts"
    CopyFiles "$INSTDIR\scripts\*.*" "$INSTDIR\backup_scripts\"

    no_scripts_to_backup:
        DetailPrint "No scripts found to back up"
!macroend

!macro postInstall
    ; Check if the backup folder exists and contains files
    IfFileExists "$INSTDIR\backup_scripts\*.*" 0 no_backup_found

    ; Restore files from backup to scripts folder
    DetailPrint "Restoring files from $INSTDIR\backup_scripts to $INSTDIR\scripts"
    CopyFiles "$INSTDIR\backup_scripts\*.*" "$INSTDIR\scripts\*"

    ; Remove the backup folder after restoring
    DetailPrint "Removing backup folder $INSTDIR\backup_scripts"
    RMDir /r "$INSTDIR\backup_scripts"

    no_backup_found:
        DetailPrint "No backup found to restore"
!macroend

; Electron Builder will call this function before installing files
Function .onInit
    DetailPrint "Running pre-install actions..."
    !insertmacro preInstall
FunctionEnd

; Electron Builder will call this function after installing files
Function .onInstSuccess
    DetailPrint "Running post-install actions..."
    !insertmacro postInstall
FunctionEnd