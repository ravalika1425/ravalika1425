# Use an official Node.js image as the base image
FROM node:16-slim

# Install bash
RUN apt-get update && apt-get install -y bash && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package.json ./

# Install the dependencies
RUN npm install --force

# Copy the rest of the application code to the working directory
COPY . .

# Create a script to handle runtime environment variables
RUN echo '#!/bin/bash\n\
\n\
# Create or clear config file\n\
echo "window.runtime_config = {" > ./build/config.js\n\
\n\
# Map environment variables to config properties\n\
declare -A env_mapping=(\n\
    ["REACT_APP_APP_REDIRECT_URI"]="REDIRECT_URI"\n\
    ["REACT_APP_MSAL_CLIENTID"]="MSAL_CLIENTID"\n\
    ["REACT_APP_MSAL_AUTH"]="MSAL_AUTH"\n\
    ["REACT_APP_MLO_SERVER"]="MLO_SERVER"\n\
)\n\
\n\
# Loop through environment variables\n\
while IFS="=" read -r key value; do\n\
    if [[ $key == REACT_APP_* ]]; then\n\
        # Get the mapped config name\n\
        config_name=${env_mapping[$key]}\n\
        if [[ ! -z "$config_name" ]]; then\n\
            # Properly escape special characters in the value\n\
            escaped_value=$(echo "$value" | sed "s/\"/\\\\\"/g")\n\
            echo "  $config_name: \"$escaped_value\"," >> ./build/config.js\n\
        fi\n\
    fi\n\
done < <(env)\n\
\n\
echo "};" >> ./build/config.js\n\
\n\
# Start the server\n\
exec serve -s build -l 4200\n\
' > ./start.sh

# Make the script executable
RUN chmod +x ./start.sh

# Build the React application for production
RUN npm run build

# Install a lightweight HTTP server to serve the static files
RUN npm install -g serve

# Expose the port the app will run on
EXPOSE 4200

# Command to run the application using our start script
CMD ["bash", "./start.sh"]