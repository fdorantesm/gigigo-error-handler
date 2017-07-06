# gigigo-error-handler

This package is an error handler for use in both development (debug) and production environments.

In production mode, `gigigo-error-handler` omits details from error responses to prevent leaking sensitive information:

- For 5xx errors, the output contains only the status code and the status name from the HTTP specification.
- For 4xx errors, the output contains the full error message (`error.message`) and the contents of the `details`
  property (`error.details`) that `ValidationError` typically uses to provide machine-readable details
  about validation problems. It also includes `error.code` to allow a machine-readable error code to be passed
  through which could be used, for example, for translation.

In debug mode, `gigigo-error-handler` returns full error stack traces and internal details of any error objects to the client in the HTTP responses.