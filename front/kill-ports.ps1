# Script para liberar portas e iniciar os servidores
# Mata processos nas portas 3000 e 4200 se existirem
$ports = @(3000, 4200)
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
        # Porta ja livre
    }
}
Write-Host "Portas livres. Iniciando servidores..."
