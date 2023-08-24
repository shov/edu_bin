#include "quit_game_entity.h"
#include "../game_engine.h"
#include "../input_manager.h"

void QuitGameEntity::Update(float dt, GameEngine *engine, InputManager *inputManager)
{
    if (inputManager->IsKeyDown(VK_ESCAPE))
    {
        engine->RegisterMessage(EGameEngineMessage::GEM_QUIT);
    }
    return;
};