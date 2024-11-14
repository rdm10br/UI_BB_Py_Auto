!macro preInstall
    ; Backup existing scripts folder if it exists
    IfFileExists "$INSTDIR\scripts\*.*" 0 no_scripts_to_backup
    DetailPrint "Backing up scripts folder"
    CreateDirectory "$INSTDIR\..\backup_scripts"
    
    ; Suppress details and copy files silently
    SetDetailsPrint none
    CopyFiles /SILENT "$INSTDIR\scripts\*.*" "$INSTDIR\..\backup_scripts\"
    SetDetailsPrint lastused

    no_scripts_to_backup:
        DetailPrint "No scripts folder found to back up"
!macroend

!macro postInstall
    ; Restore the backed-up scripts folder
    IfFileExists "$INSTDIR\..\backup_scripts\*.*" 0 no_backup_found
    DetailPrint "Restoring scripts folder"

    ; Suppress details and copy files silently
    SetDetailsPrint none
    CopyFiles /SILENT "$INSTDIR\..\backup_scripts\*.*" "$INSTDIR\scripts\"
    SetDetailsPrint lastused

    ; Clean up backup folder
    DetailPrint "Cleaning up backup folder"
    SetDetailsPrint none
    RMDir /r "$INSTDIR\..\backup_scripts"
    SetDetailsPrint lastused

    no_backup_found:
        DetailPrint "No backup folder found to restore"
!macroend

!macro customInit
    !insertmacro preInstall
!macroend

!macro customInstall
    !insertmacro postInstall
!macroend