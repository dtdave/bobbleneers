param(
    [string] $url, # base API URL
    [string] $token, # legacy token
    [string] $clientId, #oAuth clientId
    [string] $secret #oAuth Secret
)

if ($Matches) { Clear-Variable Matches }
$url -match '\w{8}' | Out-Null
if ($Matches) { $cleanTenantID = $Matches[0] }
else { write-host "Tenant ID should be at least 8 alphanumeric characters." }
if ($tenantID -like "*sprint*") {
    # Sprint tenant
    $validUrl = "$cleanTenantID.sprint.dynatracelabs.com"
}
else {
    # Assumne live tenant
    $validUrl = "$cleanTenantID.live.dynatrace.com"
}
$env:tenantUri = $validUrl
$env:tenantToken = $token
$env:clientId = $clientId
$env:clientSecret = $secret