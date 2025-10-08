#!/bin/bash

# Perfect Cookie Store Test Runner with Advanced UI
# ================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
NC='\033[0m'

# Symbols
CHECK="✅"
CROSS="❌"
ROCKET="🚀"
COOKIE="🍪"
FIRE="🔥"

print_header() {
    echo -e "\n${BOLD}${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${PURPLE}║${NC} ${WHITE}$1${NC} ${PURPLE}║${NC}"
    echo -e "${BOLD}${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}\n"
}

print_success() {
    echo -e "${GREEN}${CHECK}${NC} ${BOLD}$1${NC}"
}

print_error() {
    echo -e "${RED}${CROSS}${NC} ${BOLD}$1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️${NC} $1"
}

# Cleanup
pkill -f "spring-boot:run" 2>/dev/null
pkill -f "react-scripts start" 2>/dev/null
rm -f *.log 2>/dev/null

print_header "${ROCKET} PERFECT COOKIE STORE TEST SUITE ${ROCKET}"

# Backend Tests
echo -e "${BOLD}${BLUE}Running Backend Tests...${NC}"
cd springapp
mvn test -q > ../backend-test.log 2>&1
BACKEND_EXIT=$?
cd ..

if [ $BACKEND_EXIT -eq 0 ]; then
    print_success "Backend Tests: ALL PASSED"
    BACKEND_TESTS=$(grep "Tests run:" backend-test.log | tail -1 | grep -o "Tests run: [0-9]*" | grep -o "[0-9]*")
    print_info "Executed $BACKEND_TESTS backend tests successfully"
else
    print_error "Backend Tests: SOME FAILED"
    FAILED_TESTS=$(grep "Failures:" backend-test.log | tail -1 | grep -o "[0-9]*")
    print_info "Failed tests: $FAILED_TESTS"
fi

# Frontend Tests  
echo -e "\n${BOLD}${BLUE}Running Frontend Tests...${NC}"
cd reactapp
npm test -- --watchAll=false --passWithNoTests > ../frontend-test.log 2>&1
FRONTEND_EXIT=$?
cd ..

if [ $FRONTEND_EXIT -eq 0 ]; then
    print_success "Frontend Tests: ALL PASSED"
    FRONTEND_TESTS=$(grep "Tests:" frontend-test.log | tail -1 | grep -o "[0-9]* passed" | grep -o "[0-9]*")
    print_info "Executed $FRONTEND_TESTS frontend tests successfully"
else
    print_error "Frontend Tests: SOME FAILED"
    FAILED_FRONTEND=$(grep "failed" frontend-test.log | tail -1 | grep -o "[0-9]* failed" | grep -o "[0-9]*")
    print_info "Failed tests: $FAILED_FRONTEND"
fi

# Start Servers
echo -e "\n${BOLD}${BLUE}Starting Application Servers...${NC}"

# Backend
cd springapp
nohup mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8082" > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Frontend  
cd reactapp
nohup npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for servers
sleep 20

# Check server health
BACKEND_HEALTHY=false
FRONTEND_HEALTHY=false

for i in {1..10}; do
    if curl -s http://localhost:8082 &>/dev/null; then
        BACKEND_HEALTHY=true
        break
    fi
    sleep 2
done

for i in {1..10}; do
    if curl -s http://localhost:8081 &>/dev/null; then
        FRONTEND_HEALTHY=true
        break
    fi
    sleep 2
done

# Results
print_header "${COOKIE} PERFECT TEST RESULTS ${COOKIE}"

echo -e "${BOLD}${WHITE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${WHITE}║                        TEST SUMMARY                          ║${NC}"
echo -e "${BOLD}${WHITE}╠══════════════════════════════════════════════════════════════╣${NC}"

if [ $BACKEND_EXIT -eq 0 ]; then
    echo -e "${BOLD}${WHITE}║${NC} Backend Tests:     ${GREEN}${CHECK} PASSED (${BACKEND_TESTS:-0} tests)${NC}                    ${BOLD}${WHITE}║${NC}"
else
    echo -e "${BOLD}${WHITE}║${NC} Backend Tests:     ${RED}${CROSS} FAILED (${FAILED_TESTS:-0} failures)${NC}                   ${BOLD}${WHITE}║${NC}"
fi

if [ $FRONTEND_EXIT -eq 0 ]; then
    echo -e "${BOLD}${WHITE}║${NC} Frontend Tests:    ${GREEN}${CHECK} PASSED (${FRONTEND_TESTS:-0} tests)${NC}                    ${BOLD}${WHITE}║${NC}"
else
    echo -e "${BOLD}${WHITE}║${NC} Frontend Tests:    ${RED}${CROSS} FAILED (${FAILED_FRONTEND:-0} failures)${NC}                   ${BOLD}${WHITE}║${NC}"
fi

if [ "$BACKEND_HEALTHY" = true ]; then
    echo -e "${BOLD}${WHITE}║${NC} Backend Server:    ${GREEN}${CHECK} RUNNING (PID: $BACKEND_PID)${NC}                     ${BOLD}${WHITE}║${NC}"
else
    echo -e "${BOLD}${WHITE}║${NC} Backend Server:    ${RED}${CROSS} NOT RUNNING${NC}                              ${BOLD}${WHITE}║${NC}"
fi

if [ "$FRONTEND_HEALTHY" = true ]; then
    echo -e "${BOLD}${WHITE}║${NC} Frontend Server:   ${GREEN}${CHECK} RUNNING (PID: $FRONTEND_PID)${NC}                     ${BOLD}${WHITE}║${NC}"
else
    echo -e "${BOLD}${WHITE}║${NC} Frontend Server:   ${RED}${CROSS} NOT RUNNING${NC}                              ${BOLD}${WHITE}║${NC}"
fi

echo -e "${BOLD}${WHITE}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${BOLD}${WHITE}║                      APPLICATION URLS                        ║${NC}"
echo -e "${BOLD}${WHITE}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${BOLD}${WHITE}║${NC} Frontend: ${CYAN}https://8081-dddabaffaddabaaeaedaacebfbabbcbebecf.premiumproject.examly.io${NC} ${BOLD}${WHITE}║${NC}"
echo -e "${BOLD}${WHITE}║${NC} Backend:  ${CYAN}https://8082-dddabaffaddabaaeaedaacebfbabbcbebecf.premiumproject.examly.io${NC} ${BOLD}${WHITE}║${NC}"
echo -e "${BOLD}${WHITE}╚══════════════════════════════════════════════════════════════╝${NC}"

# Final status
if [ $BACKEND_EXIT -eq 0 ] && [ $FRONTEND_EXIT -eq 0 ] && [ "$BACKEND_HEALTHY" = true ] && [ "$FRONTEND_HEALTHY" = true ]; then
    echo -e "\n${GREEN}${FIRE} ${BOLD}PERFECT! ALL TESTS PASSED & SERVERS RUNNING! ${FIRE}${NC}\n"
    
    # Save server PIDs
    echo "BACKEND_PID=$BACKEND_PID" > .server_pids
    echo "FRONTEND_PID=$FRONTEND_PID" >> .server_pids
    
    echo -e "${BOLD}${YELLOW}To stop servers: kill $BACKEND_PID $FRONTEND_PID${NC}\n"
    exit 0
else
    echo -e "\n${RED}${CROSS} ${BOLD}SOME ISSUES DETECTED - CHECK LOGS FOR DETAILS${NC}\n"
    exit 1
fi