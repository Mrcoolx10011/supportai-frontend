# Test clients API
$loginResponse = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method POST -ContentType 'application/json' -InFile 'test-login.json'
$token = $loginResponse.token
$headers = @{'Authorization' = "Bearer $token"}
$clientsResponse = Invoke-RestMethod -Uri 'http://localhost:5000/api/entities/client' -Headers $headers
Write-Output "Clients found: $($clientsResponse.data.Count)"
$clientsResponse.data | ForEach-Object { Write-Output "- $($_.company_name) ($($_.domain))" }