!macro preInstall
  ; MessageBox MB_ICONINFORMATION "PreInstall: Checking path $INSTDIR\scripts"
  IfFileExists "$INSTDIR\scripts\*" 0 no_scripts_to_backup

  ; MessageBox MB_ICONINFORMATION "PreInstall: Creating backup folder if needed"
  IfFileExists "$INSTDIR\backup_scripts\*" 0 create_backup_folder
    Goto backup_folder_ready

  create_backup_folder:
  CreateDirectory "$INSTDIR\backup_scripts"
  ; MessageBox MB_ICONINFORMATION "PreInstall: Backup folder created"

  backup_folder_ready:
  ; MessageBox MB_ICONINFORMATION "PreInstall: Backing up files"
  SetOutPath "$INSTDIR\backup_scripts"
  CopyFiles "$INSTDIR\scripts\*" "$INSTDIR\backup_scripts\*"
  ; MessageBox MB_ICONINFORMATION "Backup completed for 'scripts' folder"
  Goto pre_install_done

  no_scripts_to_backup:
  ; MessageBox MB_ICONINFORMATION "No 'scripts' folder found to backup."

  pre_install_done:
  ; MessageBox MB_ICONINFORMATION "PreInstall Macro Finished"
!macroend

!macro postInstall
  ; MessageBox MB_ICONINFORMATION "PostInstall: Checking for backup folder"
  IfFileExists "$INSTDIR\backup_scripts\*" 0 no_backup_found

  ; MessageBox MB_ICONINFORMATION "PostInstall: Restoring files from backup"
  CopyFiles "$INSTDIR\backup_scripts\*" "$INSTDIR\scripts\*"
  RMDir /r "$INSTDIR\backup_scripts"
  ; MessageBox MB_ICONINFORMATION "Restored 'scripts' folder from backup"
  Goto post_install_done

  no_backup_found:
  ; MessageBox MB_ICONINFORMATION "No backup folder found to restore."

  post_install_done:
  ; MessageBox MB_ICONINFORMATION "PostInstall Macro Finished"
!macroend

Function preInstall
  !insertmacro preInstall
FunctionEnd

Function postInstall
  !insertmacro postInstall
FunctionEnd

Section "Main Installation"
  Call preInstall
  ; Add regular installation tasks here
  Call postInstall
SectionEnd