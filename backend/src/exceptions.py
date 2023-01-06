"""Exceptions"""


class UserAlreadyExists(Exception):
    """Exception for when the user with the specified username already existed in the database"""


class UserAuthenticationFail(Exception):
    """Exception for user authentication fail"""


class UserNotFound(Exception):
    """Exception for user not found"""
