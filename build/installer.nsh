!macro preInstall
    ; Backup existing scripts folder if it exists
    IfFileExists "$INSTDIR\scripts\*.*" 0 no_scripts_to_backup
    DetailPrint "Backing up scripts folder"
    CreateDirectory "$INSTDIR\..\backup_scripts"
    CopyFiles "$INSTDIR\scripts\*.*" "$INSTDIR\..\backup_scripts\"

    no_scripts_to_backup:
!macroend

!macro postInstall
    ; Restore the backed-up scripts folder
    IfFileExists "$INSTDIR\..\backup_scripts\*.*" 0 no_backup_found
    DetailPrint "Restoring scripts folder"
    CopyFiles "$INSTDIR\..\backup_scripts\*.*" "$INSTDIR\scripts\"

    ; Clean up backup folder
    RMDir /r "$INSTDIR\..\backup_scripts"

    no_backup_found:
!macroend

!macro customInit
    !insertmacro preInstall
!macroend

!macro customInstall
    !insertmacro postInstall
!macroend