!macro preInstall
  ; Debug: Notify the start of the backup process
  MessageBox MB_ICONINFORMATION "Starting backup process..."

  ; Check if the scripts folder exists
  IfFileExists "$INSTDIR\scripts\*" 0 no_scripts_to_backup
  ; Notify that scripts exist
  MessageBox MB_ICONINFORMATION "Scripts folder found. Proceeding with backup..."

  ; Create the backup folder if it doesn't already exist
  IfFileExists "$INSTDIR\backup_scripts\*" 0 create_backup_folder
  Goto backup_folder_ready

  create_backup_folder:
  CreateDirectory "$INSTDIR\backup_scripts"

  backup_folder_ready:
  ; Backup existing files from the scripts folder
  SetOutPath "$INSTDIR\backup_scripts"
  CopyFiles "$INSTDIR\scripts\*" "$INSTDIR\backup_scripts\*"
  Goto backup_done

  no_scripts_to_backup:
  MessageBox MB_ICONINFORMATION "No scripts folder found to backup."

  backup_done:
  ; Debug: Notify completion
  MessageBox MB_ICONINFORMATION "Backup process completed."
!macroend

!macro postInstall
  ; Debug: Notify the start of the restore process
  MessageBox MB_ICONINFORMATION "Starting restore process..."

  ; Check if a backup exists
  IfFileExists "$INSTDIR\backup_scripts\*" 0 no_backup_found
  ; Notify that backup exists
  MessageBox MB_ICONINFORMATION "Backup folder found. Restoring files..."

  ; Restore the scripts folder from the backup, overwriting existing files
  CopyFiles /SILENT /FILESONLY "$INSTDIR\backup_scripts\*" "$INSTDIR\scripts\*"
  ; Clean up the backup folder
  RMDir /r "$INSTDIR\backup_scripts"
  Goto restore_done

  no_backup_found:
  MessageBox MB_ICONINFORMATION "No backup folder found to restore."

  restore_done:
  ; Debug: Notify completion
  MessageBox MB_ICONINFORMATION "Restore process completed."
!macroend