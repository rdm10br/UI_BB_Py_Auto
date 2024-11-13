!macro preInstall
    ; Check if the scripts folder exists and contains files
    IfFileExists "$INSTDIR\scripts\*.*" 0 no_scripts_to_backup

    ; Ensure the backup folder exists
    IfFileExists "$INSTDIR\backup_scripts\*" 0 create_backup_folder

    create_backup_folder:
        CreateDirectory "$INSTDIR\backup_scripts"

    ; Copy files from scripts to backup folder
    CopyFiles "$INSTDIR\scripts\*.*" "$INSTDIR\backup_scripts\"

    no_scripts_to_backup:
        ; If no scripts are found, skip the backup
!macroend

!macro postInstall
    ; Check if the backup folder exists and contains files
    IfFileExists "$INSTDIR\backup_scripts\*.*" 0 no_backup_found

    ; Restore files from backup to scripts folder
    CopyFiles "$INSTDIR\backup_scripts\*.*" "$INSTDIR\scripts\*"

    ; Remove the backup folder after restoring
    RMDir /r "$INSTDIR\backup_scripts"

    no_backup_found:
        ; If no backup is found, skip the restore
!macroend

Function preInstall
  !insertmacro preInstall
FunctionEnd

Function postInstall
  !insertmacro postInstall
FunctionEnd

Section "Main Installation"
  Call preInstall

  Call postInstall
SectionEnd