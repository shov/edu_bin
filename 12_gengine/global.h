#ifndef GLOBAL_H
#define GLOBAL_H
#include <DirectXMath.h>

class GameEngine;
extern GameEngine *g_gameEngine;
extern const wchar_t *APP_NAME;
extern const bool FULL_SCREEN;
extern const bool VSYNC_ENABLED;
extern const float SCREEN_DEPTH;
extern const float SCREEN_NEAR;
extern const DirectX::XMFLOAT4 DEFAULT_SCREEN_COLOR;
extern const int WIDTH;
extern const int HEIGHT;


#endif