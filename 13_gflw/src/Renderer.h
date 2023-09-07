#pragma once

#include <GL/glew.h>

#define ASSERT(x) do {if (!(x)) __debugbreak();} while (0)
#define GL_CALL(x) x; ASSERT(GLErrorHandler(#x, __FILE__, __LINE__))

bool GLErrorHandler(const char* function, const char* file, int line);
