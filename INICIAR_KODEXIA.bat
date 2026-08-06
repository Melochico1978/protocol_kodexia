@echo off
title KODEXIA - Inicializando Sistema Completo
color 0A
cls
echo =======================================================
echo          PROTOCOL KODEXIA - LANCADOR UNIFICADO
echo =======================================================
echo.
echo [1/3] Compilando Backend (Spring Boot)...
echo.
cd /d "%~dp0back"
call apache-maven-3.9.6\bin\mvn.cmd package -DskipTests -q
if %errorlevel% neq 0 (
  echo.
  echo ERRO: Falha ao compilar o backend!
  pause
  exit /b 1
)
echo [OK] Backend compilado com sucesso!
echo.
echo [2/3] Iniciando Backend na porta 8080 (nova janela)...
start "KODEXIA BACKEND" cmd /k "cd /d ""%~dp0back"" && java -jar target\back-1.0.0.jar"
echo.
echo Aguardando 12 segundos para o servidor subir...
timeout /t 12 /nobreak >nul
echo.
echo [3/3] Iniciando Frontend Angular na porta 4200...
echo.
echo Abrindo navegador...
start http://localhost:4200
cd /d "%~dp0front"
title KODEXIA FRONTEND
color 0B
echo =======================================================
echo 🌐 PARA JOGAR COM OUTRA MAQUINA NA MESMA REDE (WIFI/LAN):
echo 1. Descubra o IP desta maquina (digite ipconfig em outro terminal).
echo 2. Na outra maquina, acesse: http://[SEU_IP]:4200
echo =======================================================
ng serve --host 0.0.0.0 --disable-host-check