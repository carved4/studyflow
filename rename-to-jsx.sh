#!/bin/bash

# Function to rename a file and update imports
rename_and_update() {
    local file=$1
    local dir=$(dirname "$file")
    local base=$(basename "$file" .js)
    local new_file="${dir}/${base}.jsx"
    
    # Rename the file
    mv "$file" "$new_file"
    echo "Renamed: $file -> $new_file"
    
    # Update imports in all js/jsx/ts/tsx files
    find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|${base}.js|${base}.jsx|g" {} +
}

# Navigate to src directory
cd /Users/owensmith/Desktop/full\ stack\ projects/studyflow-react/src

# Find and rename all .js files except config files
find . -type f -name "*.js" ! -path "*/config/*" ! -name "*.config.js" -exec bash -c 'rename_and_update "$0"' {} \;
