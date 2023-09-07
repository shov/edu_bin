#include "Renderer.h"

#include <iostream>

bool GLErrorHandler(const char* function, const char* file, int line)
{
    bool noErrors = true;
    GLenum error = glGetError();
    while (error != GL_NO_ERROR)
    {
        std::cout
            << file << ":" << line << " " << function << std::endl 
            << "\tOpenGL error: " << error << std::endl;
        noErrors = false;
        error = glGetError();
    }
    return noErrors;
}