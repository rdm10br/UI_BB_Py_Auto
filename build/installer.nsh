!macro preInstall
  ; Check if the scripts folder exists
  IfFileExists "$INSTDIR\scripts\*" 0 +3
  ; Create the backup folder if it doesn't already exist
  IfFileExists "$INSTDIR\backup_scripts\*" 0 +2
    CreateDirectory "$INSTDIR\backup_scripts"
  ; Backup existing files from the scripts folder
  SetOutPath "$INSTDIR\backup_scripts"
  CopyFiles "$INSTDIR\scripts\*" "$INSTDIR\backup_scripts\*"
${Else}
  MessageBox MB_ICONINFORMATION "No scripts folder found to backup."
!macroend

!macro postInstall
  ; Check if a backup exists
  IfFileExists "$INSTDIR\backup_scripts\*" 0 +3
  ; Restore the scripts folder from the backup
  CopyFiles "$INSTDIR\backup_scripts\*" "$INSTDIR\scripts\*"
  ; Clean up the backup folder
  RMDir /r "$INSTDIR\backup_scripts"
${Else}
  MessageBox MB_ICONINFORMATION "No backup folder found to restore."
!macroend