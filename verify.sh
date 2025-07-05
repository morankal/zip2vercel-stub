#!/bin/bash

# Zip2Vercel Wizard v2 Production - Verification Script
# This script verifies that all required files and configurations are in place

echo "🔍 Verifying Zip2Vercel Wizard v2 Production Setup..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1 (missing)"
        ((FAILED++))
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1/ (missing)"
        ((FAILED++))
    fi
}

# Function to check package.json dependencies
check_dependency() {
    if grep -q "\"$1\"" package.json; then
        echo -e "${GREEN}✓${NC} $1 dependency"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1 dependency (missing)"
        ((FAILED++))
    fi
}

echo -e "${BLUE}📁 Checking project structure...${NC}"
check_file "package.json"
check_file "tsconfig.json"
check_file "vite.config.ts"
check_file "tailwind.config.ts"
check_file "index.html"
check_file "README.md"
check_file ".env.example"
check_file "LICENSE"
check_file ".gitignore"

echo -e "\n${BLUE}📂 Checking directories...${NC}"
check_dir "src"
check_dir "src/components"
check_dir "src/components/ui"
check_dir "src/components/steps"
check_dir "src/lib"
check_dir "api"
check_dir "api/utils"
check_dir "samples"
check_dir "tests"
check_dir ".github/workflows"
check_dir ".husky"

echo -e "\n${BLUE}⚛️ Checking React components...${NC}"
check_file "src/main.tsx"
check_file "src/App.tsx"
check_file "src/index.css"
check_file "src/components/WizardLayout.tsx"
check_file "src/components/steps/UploadStep.tsx"
check_file "src/components/steps/GitHubStep.tsx"
check_file "src/components/steps/VercelStep.tsx"
check_file "src/components/steps/SuccessStep.tsx"

echo -e "\n${BLUE}🔧 Checking UI components...${NC}"
check_file "src/components/ui/button.tsx"
check_file "src/components/ui/card.tsx"
check_file "src/components/ui/progress.tsx"
check_file "src/lib/utils.ts"

echo -e "\n${BLUE}🔌 Checking API endpoints...${NC}"
check_file "api/upload.ts"
check_file "api/github-auth.ts"
check_file "api/deploy.ts"
check_file "api/csrf-token.ts"
check_file "api/utils/security.ts"
check_file "api/utils/github.ts"
check_file "api/utils/vercel.ts"
check_file "api/utils/upload.ts"

echo -e "\n${BLUE}🧪 Checking tests...${NC}"
check_file "playwright.config.ts"
check_file "tests/wizard-happy-path.spec.ts"
check_file "tests/invalid-zip.spec.ts"

echo -e "\n${BLUE}📦 Checking sample files...${NC}"
check_file "samples/hello-world.zip"
check_file "samples/hello-world/index.html"
check_file "samples/hello-world/style.css"
check_file "samples/hello-world/README.md"

echo -e "\n${BLUE}⚙️ Checking configuration files...${NC}"
check_file ".eslintrc.json"
check_file ".prettierrc"
check_file ".github/workflows/ci.yml"
check_file ".husky/pre-commit"

echo -e "\n${BLUE}📋 Checking key dependencies...${NC}"
if [ -f "package.json" ]; then
    check_dependency "react"
    check_dependency "typescript"
    check_dependency "tailwindcss"
    check_dependency "framer-motion"
    check_dependency "@playwright/test"
    check_dependency "helmet"
    check_dependency "express-rate-limit"
    check_dependency "react-confetti"
    check_dependency "tailwindcss-rtl"
fi

echo -e "\n${BLUE}🔒 Checking security configurations...${NC}"
if [ -f ".env.example" ]; then
    if grep -q "GITHUB_CLIENT_ID" .env.example; then
        echo -e "${GREEN}✓${NC} GitHub OAuth configuration"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} GitHub OAuth configuration"
        ((FAILED++))
    fi
    
    if grep -q "VERCEL_TOKEN" .env.example; then
        echo -e "${GREEN}✓${NC} Vercel API configuration"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Vercel API configuration"
        ((FAILED++))
    fi
    
    if grep -q "JWT_SECRET" .env.example; then
        echo -e "${GREEN}✓${NC} Security configuration"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Security configuration"
        ((FAILED++))
    fi
fi

echo -e "\n${BLUE}🌐 Checking Hebrew RTL support...${NC}"
if [ -f "index.html" ]; then
    if grep -q 'lang="he"' index.html && grep -q 'dir="rtl"' index.html; then
        echo -e "${GREEN}✓${NC} Hebrew RTL configuration"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Hebrew RTL configuration"
        ((FAILED++))
    fi
fi

if [ -f "src/index.css" ]; then
    if grep -q "hebrew-text" src/index.css; then
        echo -e "${GREEN}✓${NC} Hebrew CSS classes"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Hebrew CSS classes"
        ((FAILED++))
    fi
fi

echo -e "\n=================================================="
echo -e "${BLUE}📊 Verification Summary${NC}"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All checks passed! The project is ready for production.${NC}"
    exit 0
else
    echo -e "\n${YELLOW}⚠️  Some checks failed. Please review the missing files/configurations.${NC}"
    exit 1
fi

