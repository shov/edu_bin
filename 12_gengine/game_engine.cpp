#include "game_engine.h"
#include "a_game_entity.h"
#include "input_manager.h"
#include "window.h"
#include "direct3d.h"
#include <fstream>

bool GameEngine::ConsumeMessages()
{
    bool result = true;
    for (int i = 0; i < m_messageStack.size(); i++)
    {
        switch (m_messageStack[i])
        {
        case EGameEngineMessage::GEM_QUIT:
        {
            result = false;
        }
        default:
        {
            // for all other cases if resul set to false, keep it false
            break;
        }
        }
    }
    m_messageStack.clear();
    return result;
};

GameEngine::GameEngine()
{
    m_window = NULL;
    m_direct3d = NULL;
    m_inputManager = NULL;
};

GameEngine::~GameEngine(){};

bool GameEngine::Initialize()
{
    m_inputManager = new InputManager();
    m_window = new Window();
    if (!m_window)
    {
        return false;
    }
    m_window->Setup();

    m_direct3d = new Direct3D();
    if (!m_direct3d)
    {
        return false;
    }

    try
    {
        m_direct3d->Setup(m_window->m_width, m_window->m_height, VSYNC_ENABLED, m_window->m_hwnd, FULL_SCREEN, SCREEN_DEPTH, SCREEN_NEAR);
    }
    catch (std::exception &e)
    {
        WarnMessage(e.what());
        return false;
    }

    // Dump video card info
    wchar_t vc_name[128];
    int vc_memory = 0;
    m_direct3d->CopyVideoCardInfo(vc_name, vc_memory);
    // write to file
    std::wofstream fout;
    fout.open(L"./video_card.txt");
    fout << L"Video Card: " << vc_name << std::endl;
    fout << L"Video Memory: " << vc_memory << std::endl;
    fout.close();


    return true;
};

void GameEngine::Shutdown()
{
    for (int i = 0; i < m_gameEntities.size(); i++)
    {
        delete m_gameEntities[i];
        m_gameEntities[i] = NULL;
    }

    if (m_window)
    {
        m_window->Shutdown();
        delete m_window;
        m_window = NULL;
    }
    if (m_inputManager)
    {
        delete m_inputManager;
        m_inputManager = NULL;
    }
    return;
};

LRESULT GameEngine::HandleWinMessage(HWND hwnd, UINT umsg, WPARAM wparam, LPARAM lparam)
{
    switch (umsg)
    {
    case WM_KEYDOWN:
    {
        m_inputManager->KeyDown((unsigned int)wparam);
        return 0;
    }
    case WM_KEYUP:
    {
        m_inputManager->KeyUp((unsigned int)wparam);
        return 0;
    }
    default:
    {
        return DefWindowProc(hwnd, umsg, wparam, lparam);
    }
    }
};

void GameEngine::Run()
{
    // Receiving messages
    MSG msg;
    ZeroMemory(&msg, sizeof(MSG));
    while (true)
    {
        if (PeekMessage(&msg, NULL, 0, 0, PM_REMOVE))
        {
            TranslateMessage(&msg);
            DispatchMessage(&msg);
        }

        if (msg.message == WM_QUIT)
        {
            break;
        }

        // measure time between frames
        static float deltaTime = 0.0f;
        static DWORD lastFrameTime = 0;
        DWORD currentFrameTime = GetTickCount();
        deltaTime = (currentFrameTime - lastFrameTime) / 1000.0f;
        lastFrameTime = currentFrameTime;

        if (!Update(deltaTime))
        {
            break; // quit message received
        }
        Render(deltaTime);
    }
}

bool GameEngine::Update(float deltaTime)
{
    for (int i = 0; i < m_gameEntities.size(); i++)
    {
        m_gameEntities[i]->Update(deltaTime, this, m_inputManager);

        bool result = ConsumeMessages();
        if (!result)
        {
            return false;
        }
    }
    return true;
};

void GameEngine::Render(float deltaTime)
{

    m_direct3d->ClearBackBuffer(DEFAULT_SCREEN_COLOR);

    // Render entities

    m_direct3d->PresentBackBuffer();
    return;
};

void GameEngine::AddEntity(AGameEntity *entity)
{
    m_gameEntities.push_back(entity);
    return;
};

void GameEngine::RegisterMessage(EGameEngineMessage message)
{
    m_messageStack.push_back(message);
    return;
};

// temp function
void GameEngine::WarnMessage(const wchar_t *message)
{
    MessageBox(m_window->m_hwnd, message, L"Warning", MB_OK);
    return;
};
void GameEngine::WarnMessage(const char *message)
{
    MessageBoxA(m_window->m_hwnd, message, "Warning", MB_OK);
    return;
};

// Window message callback
LRESULT CALLBACK WinMsgCb(HWND hwnd, UINT umsg, WPARAM wparam, LPARAM lparam)
{
    switch (umsg)
    {
    case WM_DESTROY:
    {
        PostQuitMessage(0);
        return 0;
    }
    case WM_CLOSE:
    {
        PostQuitMessage(0);
        return 0;
    }
    default:
    {
        return g_gameEngine->HandleWinMessage(hwnd, umsg, wparam, lparam);
    }
    }
};