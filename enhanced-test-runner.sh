#!/bin/bash

# Enhanced Cookie Store Management System - Complete Test Suite with Perfect UI
# ============================================================================

# Colors and styling
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
NC='\033[0m'

# Unicode symbols
CHECK="✅"
CROSS="❌"
ROCKET="🚀"
GEAR="⚙️"
COOKIE="🍪"
CHART="📊"
CLOCK="⏱️"
FIRE="🔥"

# Function to print styled headers
print_header() {
    echo -e "\n${BOLD}${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${PURPLE}║${NC} ${WHITE}$1${NC} ${PURPLE}║${NC}"
    echo -e "${BOLD}${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}\n"
}

# Function to print section headers
print_section() {
    echo -e "\n${BOLD}${CYAN}▶ $1${NC}"
    echo -e "${CYAN}────────────────────────────────────────────────────────────${NC}"
}

# Function to print status messages
print_status() {
    echo -e "${BLUE}${GEAR}${NC} ${BOLD}$1${NC}"
}

print_success() {
    echo -e "${GREEN}${CHECK}${NC} ${BOLD}$1${NC}"
}

print_error() {
    echo -e "${RED}${CROSS}${NC} ${BOLD}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} ${BOLD}$1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️${NC} $1"
}

# Function to show progress bar
show_progress() {
    local duration=$1
    local message=$2
    echo -ne "${BLUE}${message}${NC} "
    for ((i=0; i<=duration; i++)); do
        echo -ne "▓"
        sleep 0.1
    done
    echo -e " ${GREEN}Done!${NC}"
}

# Function to check system requirements
check_requirements() {
    print_section "System Requirements Check"
    
    # Check Java
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2)
        print_success "Java found: $JAVA_VERSION"
    else
        print_error "Java not found!"
        exit 1
    fi
    
    # Check Maven
    if command -v mvn &> /dev/null; then
        MVN_VERSION=$(mvn -version | head -n 1 | cut -d' ' -f3)
        print_success "Maven found: $MVN_VERSION"
    else
        print_error "Maven not found!"
        exit 1
    fi
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
    else
        print_error "Node.js not found!"
        exit 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm found: v$NPM_VERSION"
    else
        print_error "npm not found!"
        exit 1
    fi
}

# Function to clean previous runs
cleanup_previous() {
    print_section "Cleanup Previous Runs"
    
    # Kill existing processes
    pkill -f "spring-boot:run" 2>/dev/null && print_info "Stopped existing Spring Boot processes"
    pkill -f "react-scripts start" 2>/dev/null && print_info "Stopped existing React processes"
    
    # Clean logs
    rm -f *.log 2>/dev/null && print_info "Cleaned previous log files"
    
    print_success "Cleanup completed"
}

# Function to build and test backend
test_backend() {
    print_section "Backend Testing & Build"
    
    cd springapp || exit 1
    
    print_status "Cleaning Maven project..."
    mvn clean > ../maven-clean.log 2>&1
    
    print_status "Compiling Spring Boot application..."
    show_progress 20 "Compiling"
    mvn compile > ../maven-compile.log 2>&1
    if [ $? -eq 0 ]; then
        print_success "Backend compilation successful"
    else
        print_error "Backend compilation failed"
        cat ../maven-compile.log
        cd ..
        return 1
    fi
    
    print_status "Running comprehensive backend tests..."
    show_progress 30 "Testing"
    mvn test > ../spring-test-results.log 2>&1
    SPRING_EXIT_CODE=$?
    
    if [ $SPRING_EXIT_CODE -eq 0 ]; then
        print_success "All backend tests passed ${CHECK}"
        
        # Extract test results
        TEST_COUNT=$(grep -o "Tests run: [0-9]*" ../spring-test-results.log | tail -1 | grep -o "[0-9]*")
        FAILURE_COUNT=$(grep -o "Failures: [0-9]*" ../spring-test-results.log | tail -1 | grep -o "[0-9]*")
        ERROR_COUNT=$(grep -o "Errors: [0-9]*" ../spring-test-results.log | tail -1 | grep -o "[0-9]*")
        
        print_info "Tests: ${TEST_COUNT:-0}, Failures: ${FAILURE_COUNT:-0}, Errors: ${ERROR_COUNT:-0}"
    else
        print_error "Backend tests failed ${CROSS}"
        tail -20 ../spring-test-results.log
    fi
    
    cd ..
    return $SPRING_EXIT_CODE
}

# Function to test frontend
test_frontend() {
    print_section "Frontend Testing & Build"
    
    cd reactapp || exit 1
    
    print_status "Installing React dependencies..."
    show_progress 25 "Installing"
    npm install > ../npm-install.log 2>&1
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        cat ../npm-install.log
        cd ..
        return 1
    fi
    
    print_status "Running comprehensive frontend tests..."
    show_progress 20 "Testing"
    CI=true npm test -- --watchAll=false --verbose --coverage > ../react-test-results.log 2>&1
    REACT_EXIT_CODE=$?
    
    if [ $REACT_EXIT_CODE -eq 0 ]; then
        print_success "All frontend tests passed ${CHECK}"
        
        # Extract coverage info if available
        if grep -q "Coverage" ../react-test-results.log; then
            print_info "Test coverage report generated"
        fi
    else
        print_error "Frontend tests failed ${CROSS}"
        tail -20 ../react-test-results.log
    fi
    
    cd ..
    return $REACT_EXIT_CODE
}

# Function to start servers
start_servers() {
    print_section "Starting Application Servers"
    
    # Start backend
    print_status "Starting Spring Boot backend server..."
    cd springapp
    nohup mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8082" > ../backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    print_status "Waiting for backend initialization..."
    show_progress 15 "Initializing Backend"
    
    # Check backend health
    for i in {1..30}; do
        if curl -s http://localhost:8082/actuator/health &>/dev/null || curl -s http://localhost:8082 &>/dev/null; then
            print_success "Backend server is healthy (PID: $BACKEND_PID)"
            break
        fi
        sleep 1
    done
    
    # Start frontend
    print_status "Starting React development server..."
    cd reactapp
    nohup npm start > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..
    
    print_status "Waiting for frontend initialization..."
    show_progress 10 "Initializing Frontend"
    
    # Check frontend health
    for i in {1..20}; do
        if curl -s http://localhost:8081 &>/dev/null; then
            print_success "Frontend server is healthy (PID: $FRONTEND_PID)"
            break
        fi
        sleep 1
    done
    
    echo "BACKEND_PID=$BACKEND_PID" > .server_pids
    echo "FRONTEND_PID=$FRONTEND_PID" >> .server_pids
}

# Function to run integration tests
run_integration_tests() {
    print_section "Integration Testing"
    
    print_status "Testing API endpoints..."
    
    # Test backend health
    if curl -s http://localhost:8082 &>/dev/null; then
        print_success "Backend API is accessible"
    else
        print_error "Backend API is not accessible"
        return 1
    fi
    
    # Test frontend
    if curl -s http://localhost:8081 &>/dev/null; then
        print_success "Frontend is accessible"
    else
        print_error "Frontend is not accessible"
        return 1
    fi
    
    print_success "Integration tests completed"
}

# Function to generate test report
generate_report() {
    print_section "Generating Test Report"
    
    cat > TEST_REPORT.md << EOF
# 🍪 Cookie Store Management System - Test Report

## 📊 Test Summary
- **Date**: $(date)
- **Backend Tests**: ${BACKEND_STATUS}
- **Frontend Tests**: ${FRONTEND_STATUS}
- **Integration Tests**: ${INTEGRATION_STATUS}

## 🚀 Application URLs
- **Frontend**: https://8081-dddabaffaddabaaeaedaacebfbabbcbebecf.premiumproject.examly.io
- **Backend**: https://8082-dddabaffaddabaaeaedaacebfbabbcbebecf.premiumproject.examly.io

## 📋 Server Information
- **Backend PID**: ${BACKEND_PID}
- **Frontend PID**: ${FRONTEND_PID}

## 🔧 System Information
- **Java Version**: $(java -version 2>&1 | head -n 1)
- **Node.js Version**: $(node --version)
- **Maven Version**: $(mvn -version | head -n 1)

## 📝 Test Details
### Backend Tests
$(if [ -f spring-test-results.log ]; then grep -A 5 -B 5 "Tests run:" spring-test-results.log | tail -10; else echo "No backend test results found"; fi)

### Frontend Tests
$(if [ -f react-test-results.log ]; then grep -A 3 -B 3 "Test Suites:" react-test-results.log | tail -6; else echo "No frontend test results found"; fi)

## 🛠️ Commands to Stop Servers
\`\`\`bash
kill ${BACKEND_PID} ${FRONTEND_PID}
\`\`\`
EOF
    
    print_success "Test report generated: TEST_REPORT.md"
}

# Function to display final summary
display_summary() {
    print_header "${COOKIE} COOKIE STORE TEST SUITE COMPLETE ${COOKIE}"
    
    echo -e "${BOLD}${WHITE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${WHITE}║                        TEST RESULTS                          ║${NC}"
    echo -e "${BOLD}${WHITE}╠══════════════════════════════════════════════════════════════╣${NC}"
    
    if [ "$BACKEND_STATUS" = "PASSED" ]; then
        echo -e "${BOLD}${WHITE}║${NC} Backend Tests:     ${GREEN}${CHECK} PASSED${NC}                           ${BOLD}${WHITE}║${NC}"
    else
        echo -e "${BOLD}${WHITE}║${NC} Backend Tests:     ${RED}${CROSS} FAILED${NC}                           ${BOLD}${WHITE}║${NC}"
    fi
    
    if [ "$FRONTEND_STATUS" = "PASSED" ]; then
        echo -e "${BOLD}${WHITE}║${NC} Frontend Tests:    ${GREEN}${CHECK} PASSED${NC}                           ${BOLD}${WHITE}║${NC}"
    else
        echo -e "${BOLD}${WHITE}║${NC} Frontend Tests:    ${RED}${CROSS} FAILED${NC}                           ${BOLD}${WHITE}║${NC}"
    fi
    
    if [ "$INTEGRATION_STATUS" = "PASSED" ]; then
        echo -e "${BOLD}${WHITE}║${NC} Integration Tests: ${GREEN}${CHECK} PASSED${NC}                           ${BOLD}${WHITE}║${NC}"
    else
        echo -e "${BOLD}${WHITE}║${NC} Integration Tests: ${RED}${CROSS} FAILED${NC}                           ${BOLD}${WHITE}║${NC}"
    fi
    
    echo -e "${BOLD}${WHITE}╠══════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${BOLD}${WHITE}║                      APPLICATION URLS                        ║${NC}"
    echo -e "${BOLD}${WHITE}╠══════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${BOLD}${WHITE}║${NC} Frontend: ${CYAN}https://8081-dddabaffaddabaaeaedaacebfbabbcbebecf.premiumproject.examly.io${NC} ${BOLD}${WHITE}║${NC}"
    echo -e "${BOLD}${WHITE}║${NC} Backend:  ${CYAN}https://8082-dddabaffaddabaaeaedaacebfbabbcbebecf.premiumproject.examly.io${NC} ${BOLD}${WHITE}║${NC}"
    echo -e "${BOLD}${WHITE}╚══════════════════════════════════════════════════════════════╝${NC}"
    
    if [ "$BACKEND_STATUS" = "PASSED" ] && [ "$FRONTEND_STATUS" = "PASSED" ] && [ "$INTEGRATION_STATUS" = "PASSED" ]; then
        echo -e "\n${GREEN}${FIRE} ${BOLD}ALL TESTS PASSED! APPLICATION IS READY FOR USE! ${FIRE}${NC}\n"
        return 0
    else
        echo -e "\n${RED}${CROSS} ${BOLD}SOME TESTS FAILED. CHECK THE LOGS FOR DETAILS.${NC}\n"
        return 1
    fi
}

# Main execution
main() {
    print_header "${ROCKET} ENHANCED COOKIE STORE TEST SUITE ${ROCKET}"
    
    # Initialize status variables
    BACKEND_STATUS="FAILED"
    FRONTEND_STATUS="FAILED"
    INTEGRATION_STATUS="FAILED"
    
    # Run all phases
    check_requirements
    cleanup_previous
    
    if test_backend; then
        BACKEND_STATUS="PASSED"
    fi
    
    if test_frontend; then
        FRONTEND_STATUS="PASSED"
    fi
    
    start_servers
    
    if run_integration_tests; then
        INTEGRATION_STATUS="PASSED"
    fi
    
    generate_report
    display_summary
}

# Execute main function
main "$@"