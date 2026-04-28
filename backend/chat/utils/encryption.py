from cryptography.fernet import Fernet
from django.conf import settings


def get_fernet():
    """Get Fernet instance using the server's encryption key."""
    return Fernet(settings.ENCRYPTION_KEY)


def encrypt_message(plaintext):
    """Encrypt a plaintext message string. Returns ciphertext string."""
    if not plaintext:
        return plaintext
    f = get_fernet()
    return f.encrypt(plaintext.encode()).decode()


def decrypt_message(ciphertext):
    """Decrypt a ciphertext message string. Returns plaintext string."""
    if not ciphertext:
        return ciphertext
    try:
        f = get_fernet()
        return f.decrypt(ciphertext.encode()).decode()
    except Exception:
        # If decryption fails (e.g., old unencrypted message), return as-is
        return ciphertext
