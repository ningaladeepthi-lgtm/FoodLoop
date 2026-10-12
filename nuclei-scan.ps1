
$ErrorActionPreference = "Stop"

$frontendDir = Join-Path $env:WORKSPACE "frontend"
$nuclei = "C:\Users\deepthi\go\bin\nuclei.exe"
$target = "http://127.0.0.1:5181/"
$result = Join-Path $env:WORKSPACE "nuclei-results.txt"
$stdout = Join-Path $env:WORKSPACE "nuclei-preview.log"
$stderr = Join-Path $env:WORKSPACE "nuclei-preview-error.log"

if (!(Test-Path $nuclei)) {
    throw "SCAN ERROR: Nuclei executable not found at $nuclei"
}

if (!(Test-Path (Join-Path $frontendDir "dist\index.html"))) {
    throw "SCAN ERROR: Frontend build not found."
}

$node = (Get-Command node.exe -ErrorAction Stop).Source
$vite = Join-Path $frontendDir "node_modules\vite\bin\vite.js"

if (!(Test-Path $vite)) {
    throw "SCAN ERROR: Vite executable not found."
}

# Remove previous results so old findings cannot affect this scan.
if (Test-Path $result) {
    Remove-Item $result -Force
}

# Create a fresh report, including when there are no findings.
New-Item -ItemType File -Path $result -Force | Out-Null

$server = $null

try {
    Write-Host "========================================"
    Write-Host " FOODLOOP SECURITY SCAN"
    Write-Host " Target: $target"
    Write-Host " Checks: misconfiguration and exposure"
    Write-Host " Severity threshold: medium, high, critical"
    Write-Host "========================================"

    Write-Host "Starting FoodLoop preview server..."

    $server = Start-Process `
        -FilePath $node `
        -ArgumentList @(
            $vite,
            "preview",
            "--host", "127.0.0.1",
            "--port", "5181",
            "--strictPort"
        ) `
        -WorkingDirectory $frontendDir `
        -PassThru `
        -WindowStyle Hidden `
        -RedirectStandardOutput $stdout `
        -RedirectStandardError $stderr

    $ready = $false

    for ($i = 0; $i -lt 30; $i++) {
        if ($server.HasExited) {
            throw "SCAN ERROR: Preview server stopped. Check preview logs."
        }

        try {
            $response = Invoke-WebRequest `
                -Uri $target `
                -UseBasicParsing `
                -TimeoutSec 2

            if ($response.StatusCode -eq 200) {
                $ready = $true
                break
            }
        }
        catch {
            # Give the preview server time to start.
        }

        Start-Sleep -Seconds 1
    }

    if (!$ready) {
        throw "SCAN ERROR: FoodLoop preview did not respond at $target"
    }

    Write-Host "Preview is responding. Running Nuclei checks..."

    & $nuclei `
        -u $target `
        -tags misconfig,exposure `
        -severity medium,high,critical `
        -no-interactsh `
        -timeout 10 `
        -retries 1 `
        -o $result

    $scanExitCode = $LASTEXITCODE

    if ($scanExitCode -ne 0) {
        throw "SCAN ERROR: Nuclei exited with code $scanExitCode."
    }

    $findings = @()

    if (Test-Path $result) {
        $findings = @(
            Get-Content $result |
            Where-Object { ![string]::IsNullOrWhiteSpace($_) }
        )
    }

    Write-Host ""
    Write-Host "========== SECURITY SCAN SUMMARY =========="

    if ($findings.Count -gt 0) {
        Write-Host "SECURITY SCAN FAILED"
        Write-Host "Matching findings: $($findings.Count)"
        Write-Host "Review the findings below:"
        $findings | ForEach-Object { Write-Host $_ }

        throw "SECURITY SCAN FAILED: Review nuclei-results.txt."
    }
    else {
        Write-Host "SECURITY SCAN PASSED"
        Write-Host "No matching findings were reported by the selected checks."
        Write-Host "This does not guarantee that the application is secure."
    }

    Write-Host "Report: $result"
    Write-Host "==========================================="
}
finally {
    if ($null -ne $server -and !$server.HasExited) {
        Write-Host "Stopping temporary FoodLoop preview server..."
        Stop-Process -Id $server.Id -Force
    }
}
