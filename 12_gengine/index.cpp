#define WIN32_LEAN_AND_MEAN
#define UNICODE
#define _UNICODE

#include <windows.h>
#include <vector>

const wchar_t *APP_NAME = L"DirectX11 win engine demo";
const bool FULL_SCREEN = false;
const bool VSYNC_ENABLED = true;
const float SCREEN_DEPTH = 1000.0f;
const float SCREEN_NEAR = 0.3f;

const int WIDTH = 800;
const int HEIGHT = 600;

// Engine messages
enum EGameEngineMessage
{
    GEM_QUIT = 0
};

// Prototypes
class AGameEntity;
class Window;
class InputManager;
class GameEngine
{
private:
    Window *m_window;
    InputManager *m_inputManager;

    // Game entities
    std::vector<AGameEntity *> m_gameEntities;

    // Messages stack
    std::vector<EGameEngineMessage> m_messageStack;

    bool ConsumeMessages();
public:
    GameEngine();
    ~GameEngine();

    bool Initialize();
    void Shutdown();
    LRESULT HandleWinMessage(HWND hwnd, UINT umsg, WPARAM wparam, LPARAM lparam);
    void Run();
    bool Update(float deltaTime);
    void Render(float deltaTime);
    void AddEntity(AGameEntity *entity);
    void RegisterMessage(EGameEngineMessage message);

    void WarnMessage(const wchar_t *message);
};

class AGameEntity
{
public:
    virtual void Update(float deltaTime, GameEngine *engine, InputManager *input) = 0;
    virtual void Render(float deltaTime) = 0;
};

LRESULT CALLBACK WinMsgCb(HWND, UINT, WPARAM, LPARAM);

// Globals
GameEngine *g_gameEngine = NULL;

// Window
class Window
{
private:
public:
    HWND m_hwnd;
    HINSTANCE m_hinstance;
    int m_width;
    int m_height;

    Window()
    {
        m_hwnd = NULL;
        m_hinstance = NULL;
        m_width = 0;
        m_height = 0;
    };
    ~Window(){};

    Window *Setup()
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

    void Shutdown()
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

// Input manager
class InputManager
{
private:
    bool m_keyState[256];

public:
    InputManager()
    {
        for (int i = 0; i < 256; i++)
        {
            m_keyState[i] = false;
        }
    };
    ~InputManager(){};

    void KeyDown(unsigned int key)
    {
        m_keyState[key] = true;
        return;
    };

    void KeyUp(unsigned int key)
    {
        m_keyState[key] = false;
        return;
    };

    bool IsKeyDown(unsigned int key)
    {
        return m_keyState[key];
    };
};

// Game engine :: implementation
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
{ // TODO
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

// Quit app game entity
class QuitGameEntity : public AGameEntity
{
public:
    QuitGameEntity(){};
    ~QuitGameEntity(){};

    void Update(float dt, GameEngine *engine, InputManager *inputManager)
    {
        if (inputManager->IsKeyDown(VK_ESCAPE))
        {
            engine->RegisterMessage(EGameEngineMessage::GEM_QUIT);
        }
        return;
    };

    void Render(float dt){};
};

// Entry point
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, PSTR pScmdline, int iCmdshow)
{
    g_gameEngine = new GameEngine();
    if (!g_gameEngine)
    {
        return 0;
    }
    if (!g_gameEngine->Initialize())
    {
        return 0;
    }

    QuitGameEntity *quitGameEntity = new QuitGameEntity();
    g_gameEngine->AddEntity(quitGameEntity);

    g_gameEngine->Run();

    g_gameEngine->Shutdown();
    delete g_gameEngine;
    g_gameEngine = NULL;

    return 0;
}