@echo off
title Launching Modules 
:top
cls
pause
    call npm init -y
    call npm install discord.js
    call npm install mongoose
    call npm install moment
    call npm install mathjs
    

pause
exit
goto :top