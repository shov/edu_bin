#ifndef WINDOW_H
#define WINDOW_H

#define WIN32_LEAN_AND_MEAN

#ifndef UNICODE
#define UNICODE
#endif

#ifndef _UNICODE
#define _UNICODE
#endif

#include <windows.h>
#include "global.h"

extern LRESULT CALLBACK WinMsgCb(HWND, UINT, WPARAM, LPARAM);

class Window
{
private:
public:
    HWND m_hwnd;
    HINSTANCE m_hinstance;
    int m_width;
    int m_height;

    Window();
    ~Window();
    Window *Setup();
    void Shutdown();
};

#endif