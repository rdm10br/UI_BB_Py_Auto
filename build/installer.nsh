!macro preInstall
  
  IfFileExists "$INSTDIR\scripts\*" 0 no_scripts_to_backup

  
  IfFileExists "$INSTDIR\backup_scripts\*" 0 create_backup_folder
    Goto backup_folder_ready

  create_backup_folder:
  CreateDirectory "$INSTDIR\backup_scripts"
  

  backup_folder_ready:
  
  SetOutPath "$INSTDIR\backup_scripts"
  CopyFiles "$INSTDIR\scripts\*" "$INSTDIR\backup_scripts\*"
  
  Goto pre_install_done

  no_scripts_to_backup:
  

  pre_install_done:
  
!macroend

!macro postInstall
  
  IfFileExists "$INSTDIR\backup_scripts\*" 0 no_backup_found

  
  CopyFiles "$INSTDIR\backup_scripts\*" "$INSTDIR\scripts\*"
  RMDir /r "$INSTDIR\backup_scripts"
  
  Goto post_install_done

  no_backup_found:
  

  post_install_done:
  
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

  ; SetOutPath "$INSTDIR" ; Define o diretório de instalação
  ; File /r "path\to\your\files\*" ; Copia os arquivos do projeto para o diretório de instalação
  
  ; CreateShortCut "$DESKTOP\BlackBot.lnk" "$INSTDIR\BlackBot.exe" ; Cria um atalho no desktop
  ; CreateShortCut "$SMPROGRAMS\BlackBot\Uninstall.lnk" "$INSTDIR\uninstall.exe" ; Atalho para desinstalação
  
  SilentInstall silent

  Call postInstall
SectionEnd