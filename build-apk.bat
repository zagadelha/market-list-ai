@echo off
REM Script para build e geração do APK Ionic/Angular/Capacitor

REM 1. Build do projeto Angular/Ionic (atualiza a pasta www)
echo Building Angular/Ionic project...
call ionic build
IF %ERRORLEVEL% NEQ 0 (
  echo Ionic/Angular build failed!
  exit /b %ERRORLEVEL%
)

REM 2. Sincroniza alterações com o Android (atualiza www no projeto nativo)
echo Syncing with Capacitor Android...
call npx cap sync android
IF %ERRORLEVEL% NEQ 0 (
  echo Capacitor sync failed!
  exit /b %ERRORLEVEL%
)

REM 3. Build do APK via Gradle
cd android
if exist gradlew (
  echo Building APK with Gradle...
  call gradlew assembleDebug
  IF %ERRORLEVEL% NEQ 0 (
    echo Gradle build failed!
    exit /b %ERRORLEVEL%
  )
  echo APK gerado em android\app\build\outputs\apk\debug\app-debug.apk
) else (
  echo gradlew não encontrado. Execute manualmente pelo Android Studio se necessário.
)
cd ..

echo.
echo Processo concluido com sucesso!
echo O APK estará em android\app\build\outputs\apk\debug\app-debug.apk
