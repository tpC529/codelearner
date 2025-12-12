"""
Test CORS configuration for backend.py
"""
import re
import pytest
from fastapi.testclient import TestClient
from backend import app, allowed_origins, allowed_origin_regex

client = TestClient(app)


def test_cors_allowed_origins_list():
    """Test that localhost origins are in the allowed list"""
    assert "http://localhost" in allowed_origins
    assert "http://127.0.0.1" in allowed_origins


def test_cors_regex_pattern():
    """Test that the allowed origin regex matches expected extension protocols"""
    # Chrome/Edge/Brave/DuckDuckGo extensions
    assert re.match(allowed_origin_regex, "chrome-extension://abcdefghijklmnop")
    
    # Firefox extensions
    assert re.match(allowed_origin_regex, "moz-extension://12345678-1234-1234-1234-123456789012")
    
    # Safari extensions
    assert re.match(allowed_origin_regex, "safari-web-extension://12345678-ABCD-EFGH-IJKL-123456789012")
    
    # Localhost with port
    assert re.match(allowed_origin_regex, "http://localhost:8080")
    assert re.match(allowed_origin_regex, "http://127.0.0.1:3000")
    
    # Should not match malicious origins
    assert not re.match(allowed_origin_regex, "https://malicious-site.com")
    assert not re.match(allowed_origin_regex, "http://evil.com")


def test_cors_headers_localhost():
    """Test that CORS headers are set correctly for localhost"""
    response = client.options(
        "/api",
        headers={"Origin": "http://localhost"}
    )
    assert response.status_code == 200


def test_cors_headers_chrome_extension():
    """Test that CORS headers work for chrome extension origins"""
    response = client.options(
        "/api",
        headers={"Origin": "chrome-extension://abcdefghijklmnop"}
    )
    assert response.status_code == 200


def test_cors_headers_firefox_extension():
    """Test that CORS headers work for firefox extension origins"""
    response = client.options(
        "/api",
        headers={"Origin": "moz-extension://12345678-1234-1234-1234-123456789012"}
    )
    assert response.status_code == 200


def test_api_endpoint_exists():
    """Basic test to ensure the API endpoint is accessible"""
    # Test OPTIONS request (preflight)
    response = client.options(
        "/api",
        headers={"Origin": "http://localhost"}
    )
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
