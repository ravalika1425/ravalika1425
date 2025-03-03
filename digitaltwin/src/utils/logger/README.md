# Custom Logger Utility

## Overview

The custom logger utility provides a flexible and centralized way to handle logging across the React application. It is designed to abstract the complexity of logging mechanisms and provide a consistent interface for logging messages, warnings, and errors. Additionally, it includes a method for handling exceptions, ensuring that all errors are logged in a standardized format.

## Features

- **Log Levels**: Supports different log levels (`log`, `warn`, `error`) to categorize the severity of the messages.
- **No Operation (NO_OP)**: For certain log levels, a no-operation function is used to prevent logging, allowing for dynamic log level management.
- **Exception Handling**: Includes a dedicated method for handling exceptions, which logs both the error message and stack trace.
- **Browser Console Output**: By default, logs are output to the browser's console, making it easy to view logs during development or troubleshooting.

## Usage

To use the custom logger in your application, first import the `logger` instance from the logger utility file.

Then, you can use the `log`, `warn`, `error`, and `handleException` methods as needed.

## Configuration

The logger can be configured with different log levels upon instantiation. The log level determines which types of logs are actually outputted. For example, setting the log level to `error` will only output error messages, and all other logs will be ignored.

### Setting Log Level

The log level can be set by passing an options object with a `level` property to the `ConsoleLogger` constructor. The log level is typically read from an environment variable to allow for easy configuration without code changes.

## Best Practices

- **Environment-Specific Log Levels**: Consider setting different log levels for different environments (e.g., `error` for production, `log` for development) to control the verbosity of logs.
- **Sensitive Information**: Be cautious not to log sensitive information that could potentially be exposed in the console.
- **Error Handling**: Utilize the `handleException` method for consistent logging of exceptions, including the stack trace for easier debugging.

## Conclusion

The custom logger utility provides a simple yet powerful solution for managing logging within a React application. By centralizing logging logic, it ensures consistency and ease of maintenance while offering the flexibility to adjust log verbosity as needed.
