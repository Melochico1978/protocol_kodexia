
$ports = @(3000, 3001, 4200)
foreach ($port in $ports) {
    try {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connections) {
            foreach ($conn in $connections) {
                Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
            }
            Write-Host "Porta $port liberada."
        }
    } catch {
   
    }
}
Write-Host "Portas livres. Iniciando servidores..."
