import pytest

def test_example_is_working(page):
    page.goto("/")
    page.click('text=Hello, sign in')
    page.click('//input[@id = "continue"]')
