#include <windows.h>
#include "global.h"
#include "./entities/quit_game_entity.h"
#include "./game_engine.h"


const wchar_t *APP_NAME = L"DirectX11 win engine demo";
const bool FULL_SCREEN = true;
const bool VSYNC_ENABLED = true;
const float SCREEN_DEPTH = 1000.0f;
const float SCREEN_NEAR = 0.3f;
const DirectX::XMFLOAT4 DEFAULT_SCREEN_COLOR = DirectX::XMFLOAT4(0.5f, 0.5f, 0.5f, 0.0f);

const int WIDTH = 800;
const int HEIGHT = 600;
GameEngine *g_gameEngine = NULL;

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