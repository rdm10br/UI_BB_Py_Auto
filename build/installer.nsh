!macro preInstall
  ; Backup the existing 'scripts' folder
  SetOutPath "$INSTDIR\backup_scripts"
  CopyFiles "$INSTDIR\scripts\*" "$INSTDIR\backup_scripts\*"
!macro

!macro postInstall
  ; Restore the 'scripts' folder after installation
  CopyFiles "$INSTDIR\backup_scripts\*" "$INSTDIR\scripts\*"
  RMDir /r "$INSTDIR\backup_scripts"
!macro