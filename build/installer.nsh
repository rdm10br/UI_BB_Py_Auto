!macro preInstall
    ; Backup existing scripts if they exist
    IfFileExists "$INSTDIR\scripts\*.*" 0 no_scripts_to_backup

    ; Ensure the backup folder exists
    CreateDirectory "$INSTDIR\backup_scripts"

    ; Copy files from scripts to backup folder
    DetailPrint "Backing up files from $INSTDIR\scripts to $INSTDIR\backup_scripts"
    CopyFiles "$INSTDIR\scripts\*.*" "$INSTDIR\backup_scripts\"

    no_scripts_to_backup:
        DetailPrint "No scripts found to back up"
!macroend

!macro postInstall
    ; Restore scripts from backup
    IfFileExists "$INSTDIR\backup_scripts\*.*" 0 no_backup_found

    DetailPrint "Restoring files from $INSTDIR\backup_scripts to $INSTDIR\scripts"
    CopyFiles "$INSTDIR\backup_scripts\*.*" "$INSTDIR\scripts\*"

    ; Clean up backup folder
    DetailPrint "Cleaning up backup folder $INSTDIR\backup_scripts"
    RMDir /r "$INSTDIR\backup_scripts"

    no_backup_found:
        DetailPrint "No backup found to restore"
!macroend

; Custom initialization (pre-install actions)
!macro customInit
    !insertmacro preInstall
!macroend

; Custom installation (post-install actions)
!macro customInstall
    !insertmacro postInstall
!macroend