@echo off
REM Script para build e geração do APK Ionic/Angular/Capacitor

REM 1. Atualiza dependências (opcional, mas recomendado)
echo Atualizando dependências...
call npm install
IF %ERRORLEVEL% NEQ 0 (
  echo Falha ao instalar dependências!
  exit /b %ERRORLEVEL%
)

REM 2. Build do projeto Angular/Ionic (atualiza a pasta www)
echo Building Angular/Ionic project...
call npx ionic build --no-cache
IF %ERRORLEVEL% NEQ 0 (
  echo Ionic/Angular build failed!
  exit /b %ERRORLEVEL%
)

REM 3. Sincroniza alterações com o Android (atualiza www no projeto nativo)
echo Syncing with Capacitor Android...
call npx cap sync android
IF %ERRORLEVEL% NEQ 0 (
  echo Capacitor sync failed!
  exit /b %ERRORLEVEL%
)

REM 4. Build do APK via Gradle
cd android
if exist gradlew (
  echo Limpando build anterior...
  call gradlew clean --no-daemon
  IF %ERRORLEVEL% NEQ 0 (
    echo Gradle clean failed!
    exit /b %ERRORLEVEL%
  )
  echo Building APK with Gradle...
  call gradlew assembleDebug --no-daemon --stacktrace
  IF %ERRORLEVEL% NEQ 0 (
    echo Gradle build failed! Veja o erro acima para detalhes.
    exit /b %ERRORLEVEL%
  )
  if exist app\build\outputs\apk\debug\app-debug.apk (
    echo APK gerado em android\app\build\outputs\apk\debug\app-debug.apk
  ) else (
    echo ERRO: APK não foi gerado! Verifique os logs do Gradle para detalhes.
  )
) else (
  echo gradlew nao encontrado. Execute manualmente pelo Android Studio se necessário.
)
cd ..

echo.
echo Processo concluido!
echo O APK estará em android\app\build\outputs\apk\debug\app-debug.apk se não houver erros.
