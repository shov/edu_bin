
#ifndef GAME_ENGINE_H_
#define GAME_ENGINE_H_

#ifndef UNICODE
#define UNICODE
#endif

#include <vector>
#include <windows.h>

class Window;
class InputManager;
class AGameEntity;
class Direct3D;

// Engine messages
enum EGameEngineMessage
{
    GEM_QUIT = 0,
};

class GameEngine
{
private:
    Window *m_window;
    InputManager *m_inputManager;
    Direct3D *m_direct3d;

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
    void WarnMessage(const char *message);
};

#endif