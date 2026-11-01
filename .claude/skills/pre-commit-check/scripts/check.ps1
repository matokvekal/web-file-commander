$ErrorActionPreference = 'Stop'

$top = & git -C $PSScriptRoot rev-parse --show-toplevel 2>$null
if ($LASTEXITCODE -ne 0 -or -not $top) {
    Write-Host 'FAIL git: not inside a git repository'
    exit 2
}
$root = "$top".Trim()
Set-Location $root

$failures = New-Object System.Collections.Generic.List[string]

function Add-Result($name, $ok, $detail) {
    $status = if ($ok) { 'PASS' } else { 'FAIL' }
    Write-Host ("{0} {1}: {2}" -f $status, $name, $detail)
    if (-not $ok) { $failures.Add($name) }
}

$agentsPath = Join-Path $root 'AGENTS.md'
$packagePath = Join-Path $root 'package.json'
$hasInstructions = (Test-Path $agentsPath) -and (Test-Path $packagePath)
Add-Result 'rules-files' $hasInstructions 'AGENTS.md and package.json exist'

if ($hasInstructions) {
    $agents = Get-Content $agentsPath -Raw
    $scripts = (Get-Content $packagePath -Raw | ConvertFrom-Json).scripts.PSObject.Properties.Name

    $mentioned = [regex]::Matches($agents, 'npm run (\w+)') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
    $missingScripts = @($mentioned | Where-Object { $scripts -notcontains $_ })
    Add-Result 'rules-scripts' ($missingScripts.Count -eq 0) ("missing npm scripts: " + ($(if ($missingScripts) { $missingScripts -join ', ' } else { 'none' })))

    $paths = [regex]::Matches($agents, '`((?:src|docs)/[^`*{}\s]+\.\w+)`') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
    $missingFiles = @($paths | Where-Object { -not (Test-Path (Join-Path $root $_)) })
    Add-Result 'rules-files-exist' ($missingFiles.Count -eq 0) ("missing files: " + ($(if ($missingFiles) { $missingFiles -join ', ' } else { 'none' })))
}

$branch = (& git branch --show-current).Trim()
$status = @(& git status --porcelain)
if ($LASTEXITCODE -ne 0) {
    Add-Result 'git-status' $false 'git status failed'
} else {
    $detail = "branch '$branch', $($status.Count) changed path(s)"
    Add-Result 'git-status' $true $detail
    foreach ($line in $status) { Write-Host "  $line" }
}

& npm run check
$checkOk = ($LASTEXITCODE -eq 0)
Add-Result 'npm-run-check' $checkOk "exit code $LASTEXITCODE"

if ($failures.Count -gt 0) {
    Write-Host ("RESULT: FAIL ({0})" -f ($failures -join ', '))
    exit 1
}
Write-Host 'RESULT: PASS'
exit 0
