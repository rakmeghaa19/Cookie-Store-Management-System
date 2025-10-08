#!/bin/bash

echo "🚀 Cookie Store Management System - Complete Test Suite"
echo "======================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Start backend server
print_status "Starting Spring Boot backend server..."
cd springapp
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8082" > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
print_status "Waiting for backend to initialize..."
sleep 15

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
    print_success "Backend server started successfully (PID: $BACKEND_PID)"
else
    print_error "Failed to start backend server"
    exit 1
fi

# Run Spring Boot tests
print_status "Running Spring Boot backend tests..."
cd springapp
mvn test > ../spring-test-results.log 2>&1
SPRING_EXIT_CODE=$?
cd ..

if [ $SPRING_EXIT_CODE -eq 0 ]; then
    print_success "Spring Boot tests passed ✅"
else
    print_error "Spring Boot tests failed ❌"
    cat spring-test-results.log
fi

# Install React dependencies if needed
print_status "Installing React dependencies..."
cd reactapp
npm install > ../npm-install.log 2>&1
cd ..

# Run React tests
print_status "Running React frontend tests..."
cd reactapp
npm test -- --watchAll=false --verbose > ../react-test-results.log 2>&1
REACT_EXIT_CODE=$?
cd ..

if [ $REACT_EXIT_CODE -eq 0 ]; then
    print_success "React tests passed ✅"
else
    print_error "React tests failed ❌"
    cat react-test-results.log
fi

# Start React development server
print_status "Starting React development server..."
cd reactapp
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
print_status "Waiting for frontend to initialize..."
sleep 10

if ps -p $FRONTEND_PID > /dev/null; then
    print_success "Frontend server started successfully (PID: $FRONTEND_PID)"
else
    print_error "Failed to start frontend server"
fi

# Display summary
echo ""
echo "🎉 Test Results Summary"
echo "======================="
if [ $SPRING_EXIT_CODE -eq 0 ]; then
    print_success "Backend Tests: PASSED"
else
    print_error "Backend Tests: FAILED"
fi

if [ $REACT_EXIT_CODE -eq 0 ]; then
    print_success "Frontend Tests: PASSED"
else
    print_error "Frontend Tests: FAILED"
fi

echo ""
echo "🌐 Application URLs:"
echo "Frontend: https://8081-dddabaffaddabaaeaedaacebfbabbcbebecf.premiumproject.examly.io"
echo "Backend:  https://8082-dddabaffaddabaaeaedaacebfbabbcbebecf.premiumproject.examly.io"
echo ""
echo "📊 Server Process IDs:"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "To stop servers: kill $BACKEND_PID $FRONTEND_PID"

# Calculate overall exit code
if [ $SPRING_EXIT_CODE -eq 0 ] && [ $REACT_EXIT_CODE -eq 0 ]; then
    print_success "🎊 All tests passed! Application is ready for use."
    exit 0
else
    print_error "❌ Some tests failed. Check the logs above."
    exit 1
fi