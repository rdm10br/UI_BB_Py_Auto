!macro preInstall
  ; Check if the scripts folder exists
  MessageBox MB_ICONINFORMATION "Checking path: $INSTDIR"
  IfFileExists "$INSTDIR\scripts" 0 no_scripts_to_backup

  ; Create the backup folder if it doesn't already exist
  IfFileExists "$INSTDIR\backup_scripts" 0 create_backup_folder
    Goto backup_folder_ready

  create_backup_folder:
  CreateDirectory "$INSTDIR\backup_scripts"

  backup_folder_ready:
  ; Now backup the existing files from the scripts folder
  SetOutPath "$INSTDIR\backup_scripts"
  CopyFiles /SILENT "$INSTDIR\scripts\*" "$INSTDIR\backup_scripts\*"
  MessageBox MB_ICONINFORMATION "Backup completed for the 'scripts' folder."
  Goto pre_install_done

  no_scripts_to_backup:
  MessageBox MB_ICONINFORMATION "No 'scripts' folder found to backup."

  pre_install_done:
!macroend

!macro postInstall
  ; Check if a backup exists
  IfFileExists "$INSTDIR\backup_scripts" 0 no_backup_found

  ; Restore the scripts folder from the backup, overwriting existing files
  CopyFiles /SILENT /FILESONLY "$INSTDIR\backup_scripts\*" "$INSTDIR\scripts\*"
  ; Clean up the backup folder
  RMDir /r "$INSTDIR\backup_scripts"
  MessageBox MB_ICONINFORMATION "Restored 'scripts' folder from backup."

  no_backup_found:
  MessageBox MB_ICONINFORMATION "No backup folder found to restore."
!macroend

!insertmacro preInstall

Section
  MessageBox MB_ICONINFORMATION "Installation tasks start here"
  ; Regular installation tasks
SectionEnd

!insertmacro postInstall