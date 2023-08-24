
#include "window.h"

Window::Window()
{
    m_hwnd = NULL;
    m_hinstance = NULL;
    m_width = 0;
    m_height = 0;
};
Window::~Window(){};

Window *Window::Setup()
{
    // App instance
    m_hinstance = GetModuleHandle(NULL);

    // Make window class
    WNDCLASSEX wc;
    wc.style = CS_HREDRAW | CS_VREDRAW | CS_OWNDC;
    wc.lpfnWndProc = WinMsgCb;
    wc.cbClsExtra = 0;
    wc.cbWndExtra = 0;
    wc.hInstance = m_hinstance;
    wc.hIcon = LoadIcon(NULL, IDI_WINLOGO);
    wc.hIconSm = wc.hIcon;
    wc.hCursor = LoadCursor(NULL, IDC_ARROW);
    wc.hbrBackground = (HBRUSH)GetStockObject(BLACK_BRUSH);
    wc.lpszMenuName = NULL;
    wc.lpszClassName = APP_NAME;
    wc.cbSize = sizeof(WNDCLASSEX);
    RegisterClassEx(&wc);

    // Get screen resolution
    m_width = GetSystemMetrics(SM_CXSCREEN);
    m_height = GetSystemMetrics(SM_CYSCREEN);

    // Screen settings
    int posX, posY;
    DEVMODE dmScreenSettings;
    if (FULL_SCREEN)
    {
        ZeroMemory(&dmScreenSettings, sizeof(dmScreenSettings));
        dmScreenSettings.dmSize = sizeof(dmScreenSettings);
        dmScreenSettings.dmPelsWidth = (ULONG)m_width;
        dmScreenSettings.dmPelsHeight = (ULONG)m_height;
        dmScreenSettings.dmBitsPerPel = 32;
        dmScreenSettings.dmFields = DM_BITSPERPEL | DM_PELSWIDTH | DM_PELSHEIGHT;
        ChangeDisplaySettings(&dmScreenSettings, CDS_FULLSCREEN);
        posX = posY = 0;
    }
    else
    {
        m_width = WIDTH;
        m_height = HEIGHT;
        posX = (GetSystemMetrics(SM_CXSCREEN) - m_width) / 2;
        posY = (GetSystemMetrics(SM_CYSCREEN) - m_height) / 2;
    }

    // Create window
    m_hwnd = CreateWindowEx(
        WS_EX_APPWINDOW,
        APP_NAME,
        APP_NAME,
        WS_CLIPSIBLINGS | WS_CLIPCHILDREN | WS_POPUP,
        posX,
        posY,
        m_width,
        m_height,
        NULL,
        NULL,
        m_hinstance,
        NULL);
    ShowWindow(m_hwnd, SW_SHOW);
    SetForegroundWindow(m_hwnd);
    SetFocus(m_hwnd);
    ShowCursor(false);

    return this;
};

void Window::Shutdown()
{
    ShowCursor(true);
    if (FULL_SCREEN)
    {
        ChangeDisplaySettings(NULL, 0);
    }
    DestroyWindow(m_hwnd);
    m_hwnd = NULL;
    UnregisterClass(APP_NAME, m_hinstance);
    m_hinstance = NULL;
    return;
};