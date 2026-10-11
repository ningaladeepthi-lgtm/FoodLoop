
$ErrorActionPreference = "Stop"

$frontendDir = Join-Path $env:WORKSPACE "frontend"
$nuclei = "C:\Users\deepthi\go\bin\nuclei.exe"
$target = "http://127.0.0.1:5181/"
$result = Join-Path $env:WORKSPACE "nuclei-results.txt"
$stdout = Join-Path $env:WORKSPACE "nuclei-preview.log"
$stderr = Join-Path $env:WORKSPACE "nuclei-preview-error.log"

if (!(Test-Path $nuclei)) {
    throw "Nuclei executable not found at $nuclei. Check the Jenkins service account permissions and path."
}

if (!(Test-Path (Join-Path $frontendDir "dist\index.html"))) {
    throw "Frontend build not found. Run the Frontend Build stage first."
}

$node = (Get-Command node.exe -ErrorAction Stop).Source
$vite = Join-Path $frontendDir "node_modules\vite\bin\vite.js"

if (!(Test-Path $vite)) {
    throw "Vite executable not found. Check frontend dependencies."
}

$server = $null

try {
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
            throw "FoodLoop preview server exited early. Check nuclei-preview-error.log."
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
            # The preview server may need more time to start.
        }

        Start-Sleep -Seconds 1
    }

    if (!$ready) {
        throw "FoodLoop preview did not respond at $target. Check the preview logs."
    }

    Write-Host "FoodLoop is responding. Starting Nuclei..."

    & $nuclei `
        -u $target `
        -tags tech `
        -no-interactsh `
        -timeout 10 `
        -retries 1 `
        -o $result

    if ($LASTEXITCODE -ne 0) {
        throw "Nuclei scan failed with exit code $LASTEXITCODE."
    }

    Write-Host "Nuclei scan finished."
    Write-Host "Results file: $result"

    if (Test-Path $result) {
        Get-Content $result
    }
}
finally {
    if ($null -ne $server -and !$server.HasExited) {
        Write-Host "Stopping temporary FoodLoop preview server..."
        Stop-Process -Id $server.Id -Force
    }
}
