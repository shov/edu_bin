#include "input_manager.h"

InputManager::InputManager()
{
    for (int i = 0; i < 256; i++)
    {
        m_keyState[i] = false;
    }
};
InputManager::~InputManager(){};

void InputManager::KeyDown(unsigned int key)
{
    m_keyState[key] = true;
    return;
};

void InputManager::KeyUp(unsigned int key)
{
    m_keyState[key] = false;
    return;
};

bool InputManager::IsKeyDown(unsigned int key)
{
    return m_keyState[key];
};