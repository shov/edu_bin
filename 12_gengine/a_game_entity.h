#ifndef A_GAME_ENTITY_H_
#define A_GAME_ENTITY_H_

class GameEngine;
class InputManager;

class AGameEntity
{
public:
    virtual void Update(float deltaTime, GameEngine *engine, InputManager *input) = 0;
    virtual void Render(float deltaTime) = 0;
};

#endif