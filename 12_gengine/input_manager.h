#ifndef INPUT_MANAGER_H_
#define INPUT_MANAGER_H_

class InputManager
{
private:
    bool m_keyState[256];

public:
    InputManager();
    ~InputManager();

    void KeyDown(unsigned int key);

    void KeyUp(unsigned int key);

    bool IsKeyDown(unsigned int key);
};

#endif