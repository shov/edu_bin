#ifndef QUIT_GAME_ENTITY_H
#define QUIT_GAME_ENTITY_H

#include "../a_game_entity.h"
class GameEngine;
class InputManager;

class QuitGameEntity : public AGameEntity
{
public:
    QuitGameEntity(){};
    ~QuitGameEntity(){};

    void Update(float dt, GameEngine *engine, InputManager *inputManager);

    void Render(float dt){};
};

#endif