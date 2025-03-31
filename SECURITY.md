# Security Policy

## Supported Versions

We release security updates for the following versions of the application:

| Version | Supported          |
|---------|------------------|
| 1.x     | ✅ Yes           |
| 0.x     | ❌ No            |

Please upgrade to a supported version to receive security patches.

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly. To do so:

1. **Do not disclose publicly**
2. **Include deta
3. **Wait for a response**

## Security Best Practices

To ensure security in our application, we follow these principles:

- **Input Validation**: Prevent SQL injection and other attacks by validating and sanitizing inputs.
- **Authentication & Authorization**: Use strong authentication mechanisms and least privilege principles.
- **Encryption**: Store sensitive data securely and use TLS for data transmission.
- **Dependency Management**: Regularly update dependencies to patch vulnerabilities.
- **Logging & Monitoring**: Detect suspicious activity by implementing logging and monitoring solutions.

## Specific Security Considerations for Company App Back-end

As the back-end of the Company App handles user authentication, event management, and administrator actions, the following additional security measures are emphasized:

- **JWT Security**: Ensure JWTs are signed with a strong secret and have a reasonable expiration time.
- **Admin Privileges**: Restrict event creation and dashboard access to authorized administrators only.
- **Secure Database Access**: Use prepared statements and ORM security features to prevent SQL injection.
- **Environment Variables**: Never expose secrets (e.g., `JWT_SECRET`) in public repositories.
- **API Rate Limiting**: Implement request throttling to prevent brute-force attacks.
- **CORS Configuration**: Restrict API access to allowed front-end origins.

## Responsible Disclosure

We appreciate and acknowledge security researchers who report vulnerabilities responsibly. Upon confirmation, we may provide credit in release notes if desired.

---
