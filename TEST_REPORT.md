# 🍪 Cookie Store Management System - Test Report

## 📊 Test Summary
- **Date**: Sat 27 Sep 2025 06:49:25 AM UTC
- **Backend Tests**: FAILED
- **Frontend Tests**: FAILED
- **Integration Tests**: FAILED

## 🚀 Application URLs
- **Frontend**: https://8081-dddabaffaddabaaeaedaacebfbabbcbebecf.premiumproject.examly.io
- **Backend**: https://8082-dddabaffaddabaaeaedaacebfbabbcbebecf.premiumproject.examly.io

## 📋 Server Information
- **Backend PID**: 4640
- **Frontend PID**: 4955

## 🔧 System Information
- **Java Version**: openjdk version "17.0.15" 2025-04-15
- **Node.js Version**: v14.17.1
- **Maven Version**: [1mApache Maven 3.6.3[m

## 📝 Test Details
### Backend Tests
[[1;31mERROR[m] [1;31m  EnhancedCookieTests.addCookieWithMissingFieldsReturnsBadRequest:169 Status expected:<400> but was:<200>[m
[[1;31mERROR[m] [1;31m  EnhancedCookieTests.handleUnicodeCharactersInCookieName:370 Status expected:<200> but was:<500>[m
[[1;31mERROR[m] [1;31m  EnhancedCookieTests.postWithoutJWTReturnsUnauthorized:269 Status expected:<401> but was:<200>[m
[[1;34mINFO[m] 
[[1;31mERROR[m] [1;31mTests run: 33, Failures: 5, Errors: 0, Skipped: 0[m
[[1;34mINFO[m] 
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[[1;34mINFO[m] [1;31mBUILD FAILURE[m
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[[1;34mINFO[m] Total time:  6.746 s

### Frontend Tests
  api.js                  |       0 |        0 |       0 |       0 | 1-45                  
--------------------------|---------|----------|---------|---------|-----------------------
Test Suites: 2 failed, 2 total
Tests:       19 failed, 9 passed, 28 total
Snapshots:   0 total
Time:        15.64 s, estimated 16 s

## 🛠️ Commands to Stop Servers
```bash
kill 4640 4955
```
