packages_path='./packages'
required_packages=("node_modules")
config_packages=()

cd $packages_path

# Collect required packages by iterating over packages folder.
for dir in *; do
    if [ -d "$dir/node_modules" ]; then
        required_packages+=("packages/$dir/node_modules")
    fi
done

# Create a list of package paths found in .circleci/config.yml
while read -r line; do
    config_packages+=("$(echo "${line}" | cut -d '"' -f 2)");
done <<< "$(sed -n '/VERIFY_CACHE_FOLDERS_START/,/VERIFY_CACHE_FOLDERS_END/p' '../.circleci/config.yml')"

# Compare list in config.yml with required packages
start_idx=1                          # Filter out VERIFY_CACHE_FOLDERS_START
end_idx="${#config_packages[@]} - 1" # Filter out VERIFY_CACHE_FOLDERS_END
has_required_packages=True

for (( i=0; i < ${#required_packages[@]}; i++ )); do
    has_found_entry=False

    for (( j=$start_idx; j < $end_idx; j++ )); do
        if [[ "${required_packages[i]}" == "${config_packages[j]}" ]]; then
            has_found_entry=True
            break;
        fi
    done

    # If we couldn't find value for required package, lists are not equal.
    if [[ $has_found_entry == False ]]; then
        echo "Error: Unable to find required '${required_packages[i]}' in paths."
        has_required_packages=False
    fi
done

if [[ $has_required_packages == False ]]; then
    echo 'CircleCI config is not OK! ✗'
    exit 1;
else
    echo 'CircleCI config looks OK! ✓'
    exit 0;
fi
